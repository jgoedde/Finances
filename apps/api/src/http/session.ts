import { createMiddleware } from "hono/factory";
import type { Auth } from "../auth/auth.ts";
import type { DB } from "../db/database.ts";
import { apiError } from "./api-error.ts";

export interface AppEnv {
    Variables: {
        /**
         * Set for every request by `createApp`.
         */
        db: DB;

        /**
         * Set for every request by `createApp`.
         */
        auth: Auth;

        /**
         * Set by `requireUser`.
         */
        userId: string;

        /**
         * Set by `requireUser`.
         */
        role: string | null;
    };
}

/**
 * Rejects requests without a valid session; exposes the user id.
 */
export const requireUser = createMiddleware<AppEnv>(async (c, next) => {
    const result = await c.var.auth.api.getSession({
        headers: c.req.raw.headers,
    });
    if (!result) {
        return apiError(c, "unauthorized", 401);
    }
    c.set("userId", result.user.id);
    c.set("role", result.user.role ?? null);
    await next();
});

/**
 * Must run after `requireUser`.
 */
export const requireAdmin = createMiddleware<AppEnv>(async (c, next) => {
    if (c.get("role") !== "admin") {
        return apiError(c, "forbidden", 403);
    }
    await next();
});
