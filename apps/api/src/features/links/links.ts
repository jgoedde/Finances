import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import type { CreatedLink } from "@finances/shared";
import type { DB } from "#/db/database.ts";
import type { InvitesTable } from "#/db/schema.ts";

// Invites and password reset links share the `invites` table; its `kind`
// column stores "signup" for invites.

const HOUR_MS = 60 * 60 * 1000;
const INVITE_LIFETIME_MS = 7 * 24 * HOUR_MS;
const PASSWORD_RESET_LINK_LIFETIME_MS = 24 * HOUR_MS;

export const tokenParam = z.object({ token: z.string().min(1).max(200) });

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
 * The link behind `token` if it is unused and unexpired.
 */
export function findUsableLink(db: DB, token: string) {
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
export async function claimLink(db: DB, token: string): Promise<boolean> {
    const result = await db
        .updateTable("invites")
        .set({ used_at: Date.now() })
        .where("token_hash", "=", hashToken(token))
        .where("used_at", "is", null)
        .where("expires_at", ">", Date.now())
        .executeTakeFirst();
    return result.numUpdatedRows === 1n;
}

/**
 * Makes a claimed link usable again, e.g. after redeeming it failed.
 */
export async function releaseLink(db: DB, token: string): Promise<void> {
    await db
        .updateTable("invites")
        .set({ used_at: null })
        .where("token_hash", "=", hashToken(token))
        .execute();
}
