import { redeemLinkSchema } from "@finances/shared";
import { createUser, resetPassword } from "#/auth/auth.ts";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { logger } from "#/log.ts";
import {
    claimLink,
    findUsableLink,
    releaseLink,
    tokenParam,
} from "#/features/links/links.ts";

/**
 * Public: creates the account of an invite or sets the new password of a
 * password reset link.
 */
export const redeemLink = factory.createHandlers(
    validate("param", tokenParam),
    validate("json", redeemLinkSchema),
    async (c) => {
        const { db, auth } = c.var;
        const { token } = c.req.valid("param");
        const input = c.req.valid("json");

        const link = await findUsableLink(db, token);
        if (!link) {
            return c.json({ error: "invalid_link" }, 410);
        }
        if (link.kind === "signup" && !input.username) {
            return c.json({ error: "username_required" }, 400);
        }
        if (!(await claimLink(db, token))) {
            return c.json({ error: "invalid_link" }, 410);
        }

        try {
            if (link.kind === "signup") {
                await createUser(auth, {
                    username: input.username!,
                    password: input.password,
                });
            } else {
                await resetPassword(auth, link.user_id!, input.password);
            }
        } catch (error) {
            await releaseLink(db, token);
            logger.warn(
                { err: error, kind: link.kind },
                "Redeeming link failed, link released",
            );
            if (link.kind === "signup") {
                // The placeholder email is derived from the username, so a
                // duplicate username fails as a duplicate user.
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
