import { factory } from "#/http/factory.ts";
import { logger } from "#/log.ts";
import { createInvite } from "#/features/links/links.ts";

/**
 * Admin-only.
 */
export const issueInvite = factory.createHandlers(async (c) => {
    const created = await createInvite(c.var.db, c.var.userId);
    logger.info(
        { userId: c.var.userId, expiresAt: created.expiresAt },
        "Invite created",
    );
    return c.json(created, 201);
});
