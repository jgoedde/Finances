import { createPasswordResetLinkSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { logger } from "#/log.ts";
import { createPasswordResetLink } from "#/features/links/links.ts";

/**
 * Admin-only.
 */
export const issuePasswordResetLink = factory.createHandlers(
    validate("json", createPasswordResetLinkSchema),
    async (c) => {
        const targetUserId = c.req.valid("json").userId;
        const created = await createPasswordResetLink(
            c.var.db,
            targetUserId,
            c.var.userId,
        );
        if (!created) {
            return c.json({ error: "unknown_user" }, 422);
        }
        logger.info(
            {
                userId: c.var.userId,
                targetUserId,
                expiresAt: created.expiresAt,
            },
            "Password reset link created",
        );
        return c.json(created, 201);
    },
);
