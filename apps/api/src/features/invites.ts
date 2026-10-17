import { createHash, randomBytes } from "node:crypto";
import { Hono } from "hono";
import { z } from "zod";
import {
    type CreatedInvite,
    type InviteInfo,
    acceptInviteSchema,
    createInviteSchema,
} from "@finances/shared";
import { type Auth, createUser, resetPassword } from "../auth/auth.ts";
import type { DB } from "../db/database.ts";
import type { AppEnv } from "../http/session.ts";
import { validate } from "../http/validate.ts";

const INVITE_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

const tokenParam = z.object({ token: z.string().min(1).max(200) });

function hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

/** Admin-only: issue signup and password-reset invites. */
export function adminInviteRoutes(db: DB) {
    return new Hono<AppEnv>().post(
        "/",
        validate("json", createInviteSchema),
        async (c) => {
            const input = c.req.valid("json");
            const userId =
                input.kind === "password-reset" ? input.userId : null;
            if (userId) {
                const user = await db
                    .selectFrom("user")
                    .select("id")
                    .where("id", "=", userId)
                    .executeTakeFirst();
                if (!user) {
                    return c.json({ error: "unknown_user" }, 422);
                }
            }

            const token = randomBytes(32).toString("base64url");
            const now = Date.now();
            const expiresAt = now + INVITE_LIFETIME_MS;
            await db
                .insertInto("invites")
                .values({
                    token_hash: hashToken(token),
                    kind: input.kind,
                    user_id: userId,
                    created_by: c.get("userId"),
                    created_at: now,
                    expires_at: expiresAt,
                    used_at: null,
                })
                .execute();

            const created: CreatedInvite = {
                token,
                expiresAt: new Date(expiresAt).toISOString(),
            };
            return c.json(created, 201);
        },
    );
}

/** Public: look up and redeem an invite. */
export function inviteRoutes(db: DB, auth: Auth) {
    function findUsable(token: string) {
        return db
            .selectFrom("invites")
            .leftJoin("user", "user.id", "invites.user_id")
            .select(["invites.kind", "invites.user_id", "user.username"])
            .where("invites.token_hash", "=", hashToken(token))
            .where("invites.used_at", "is", null)
            .where("invites.expires_at", ">", Date.now())
            .executeTakeFirst();
    }

    /** Marks the invite used. Returns false if someone else got there first. */
    async function claim(token: string): Promise<boolean> {
        const result = await db
            .updateTable("invites")
            .set({ used_at: Date.now() })
            .where("token_hash", "=", hashToken(token))
            .where("used_at", "is", null)
            .where("expires_at", ">", Date.now())
            .executeTakeFirst();
        return result.numUpdatedRows === 1n;
    }

    async function release(token: string): Promise<void> {
        await db
            .updateTable("invites")
            .set({ used_at: null })
            .where("token_hash", "=", hashToken(token))
            .execute();
    }

    return new Hono<AppEnv>()
        .get("/:token", validate("param", tokenParam), async (c) => {
            const invite = await findUsable(c.req.valid("param").token);
            if (!invite) {
                return c.json({ error: "invalid_invite" }, 410);
            }
            const info: InviteInfo = {
                kind: invite.kind,
                username: invite.username ?? null,
            };
            return c.json(info);
        })
        .post(
            "/:token/accept",
            validate("param", tokenParam),
            validate("json", acceptInviteSchema),
            async (c) => {
                const { token } = c.req.valid("param");
                const input = c.req.valid("json");

                const invite = await findUsable(token);
                if (!invite) {
                    return c.json({ error: "invalid_invite" }, 410);
                }
                if (invite.kind === "signup" && !input.username) {
                    return c.json({ error: "username_required" }, 400);
                }
                if (!(await claim(token))) {
                    return c.json({ error: "invalid_invite" }, 410);
                }

                try {
                    if (invite.kind === "signup") {
                        await createUser(auth, {
                            username: input.username!,
                            password: input.password,
                        });
                    } else {
                        await resetPassword(
                            auth,
                            invite.user_id!,
                            input.password,
                        );
                    }
                } catch (error) {
                    await release(token);
                    if (invite.kind === "signup") {
                        // The placeholder email is derived from the username,
                        // so a duplicate username fails as a duplicate user.
                        return c.json({ error: "username_taken" }, 409);
                    }
                    throw error;
                }
                return c.body(null, 204);
            },
        );
}
