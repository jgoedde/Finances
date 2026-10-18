import { createHash, randomBytes } from "node:crypto";
import { Hono } from "hono";
import { z } from "zod";
import {
    type CreatedLink,
    type LinkInfo,
    createPasswordResetLinkSchema,
    redeemLinkSchema,
} from "@finances/shared";
import { type Auth, createUser, resetPassword } from "../auth/auth.ts";
import type { DB } from "../db/database.ts";
import type { InvitesTable } from "../db/schema.ts";
import { logger } from "../log.ts";
import type { AppEnv } from "../http/session.ts";
import { validate } from "../http/validate.ts";

// Invites and password reset links share the `invites` table; its `kind`
// column stores "signup" for invites.

const HOUR_MS = 60 * 60 * 1000;
const INVITE_LIFETIME_MS = 7 * 24 * HOUR_MS;
const PASSWORD_RESET_LINK_LIFETIME_MS = 24 * HOUR_MS;

const tokenParam = z.object({ token: z.string().min(1).max(200) });

function hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

async function insertLink(
    db: DB,
    link: Pick<InvitesTable, "kind" | "user_id" | "created_by">,
    lifetimeMs: number,
): Promise<CreatedLink> {
    const token = randomBytes(32).toString("base64url");
    const now = Date.now();
    const expiresAt = now + lifetimeMs;
    await db
        .insertInto("invites")
        .values({
            ...link,
            token_hash: hashToken(token),
            created_at: now,
            expires_at: expiresAt,
            used_at: null,
        })
        .execute();
    return { token, expiresAt: new Date(expiresAt).toISOString() };
}

/**
 * `createdBy` is null when issued by the operator (CLI).
 */
export function createInvite(
    db: DB,
    createdBy: string | null,
): Promise<CreatedLink> {
    return insertLink(
        db,
        { kind: "signup", user_id: null, created_by: createdBy },
        INVITE_LIFETIME_MS,
    );
}

/**
 * Returns undefined if the user doesn't exist.
 */
export async function createPasswordResetLink(
    db: DB,
    userId: string,
    createdBy: string | null,
): Promise<CreatedLink | undefined> {
    const user = await db
        .selectFrom("user")
        .select("id")
        .where("id", "=", userId)
        .executeTakeFirst();
    if (!user) {
        return undefined;
    }
    return insertLink(
        db,
        { kind: "password-reset", user_id: userId, created_by: createdBy },
        PASSWORD_RESET_LINK_LIFETIME_MS,
    );
}

/**
 * Admin-only: issue invites and password reset links.
 */
export function adminLinkRoutes(db: DB) {
    return new Hono<AppEnv>()
        .post("/invites", async (c) => {
            const created = await createInvite(db, c.get("userId"));
            logger.info(
                { userId: c.get("userId"), expiresAt: created.expiresAt },
                "Invite created",
            );
            return c.json(created, 201);
        })
        .post(
            "/password-reset-links",
            validate("json", createPasswordResetLinkSchema),
            async (c) => {
                const targetUserId = c.req.valid("json").userId;
                const created = await createPasswordResetLink(
                    db,
                    targetUserId,
                    c.get("userId"),
                );
                if (!created) {
                    return c.json({ error: "unknown_user" }, 422);
                }
                logger.info(
                    {
                        userId: c.get("userId"),
                        targetUserId,
                        expiresAt: created.expiresAt,
                    },
                    "Password reset link created",
                );
                return c.json(created, 201);
            },
        );
}

/**
 * Public: look up and redeem a link of either kind.
 */
export function linkRoutes(db: DB, auth: Auth) {
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

    /**
     * Marks the link used. Returns false if someone else got there first.
     */
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
            const link = await findUsable(c.req.valid("param").token);
            if (!link) {
                return c.json({ error: "invalid_link" }, 410);
            }
            const info: LinkInfo = {
                kind: link.kind === "signup" ? "invite" : "password-reset",
                username: link.username ?? null,
            };
            return c.json(info);
        })
        .post(
            "/:token/redeem",
            validate("param", tokenParam),
            validate("json", redeemLinkSchema),
            async (c) => {
                const { token } = c.req.valid("param");
                const input = c.req.valid("json");

                const link = await findUsable(token);
                if (!link) {
                    return c.json({ error: "invalid_link" }, 410);
                }
                if (link.kind === "signup" && !input.username) {
                    return c.json({ error: "username_required" }, 400);
                }
                if (!(await claim(token))) {
                    return c.json({ error: "invalid_link" }, 410);
                }

                try {
                    if (link.kind === "signup") {
                        await createUser(auth, {
                            username: input.username!,
                            password: input.password,
                        });
                    } else {
                        await resetPassword(
                            auth,
                            link.user_id!,
                            input.password,
                        );
                    }
                } catch (error) {
                    await release(token);
                    logger.warn(
                        { err: error, kind: link.kind },
                        "Redeeming link failed, link released",
                    );
                    if (link.kind === "signup") {
                        // The placeholder email is derived from the username,
                        // so a duplicate username fails as a duplicate user.
                        return c.json({ error: "username_taken" }, 409);
                    }
                    throw error;
                }
                logger.info(
                    { kind: link.kind, targetUserId: link.user_id },
                    "Link redeemed",
                );
                return c.body(null, 204);
            },
        );
}
