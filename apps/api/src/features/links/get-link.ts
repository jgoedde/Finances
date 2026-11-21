import type { LinkInfo } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { findUsableLink, tokenParam } from "#/features/links/links.ts";
import { apiError } from "#/http/api-error.ts";

/**
 * Public: what a link is for, before redeeming it.
 */
export const getLink = factory.createHandlers(
    validate("param", tokenParam),
    async (c) => {
        const link = await findUsableLink(c.var.db, c.req.valid("param").token);
        if (!link) {
            return apiError(c, "invalid_link", 410);
        }
        const info: LinkInfo = {
            kind: link.kind === "signup" ? "invite" : "password-reset",
            username: link.username ?? null,
        };
        return c.json(info);
    },
);
