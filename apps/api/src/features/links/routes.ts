import { Hono } from "hono";
import type { AppEnv } from "#/http/session.ts";
import { getLink } from "#/features/links/get-link.ts";
import { issueInvite } from "#/features/links/issue-invite.ts";
import { issuePasswordResetLink } from "#/features/links/issue-password-reset-link.ts";
import { redeemLink } from "#/features/links/redeem-link.ts";

/**
 * Public: look up and redeem a link of either kind.
 */
export const linkRoutes = new Hono<AppEnv>()
    .get("/:token", ...getLink)
    .post("/:token/redeem", ...redeemLink);

/**
 * Admin-only: issue invites and password reset links.
 */
export const adminLinkRoutes = new Hono<AppEnv>()
    .post("/invites", ...issueInvite)
    .post("/password-reset-links", ...issuePasswordResetLink);
