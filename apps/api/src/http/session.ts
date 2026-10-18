import { createMiddleware } from "hono/factory";
import type { Auth } from "../auth/auth.ts";

export interface AppEnv {
    Variables: {
        userId: string;
        role: string | null;
    };
}

/**
 * Rejects requests without a valid session; exposes the user id.
 */
export function requireUser(auth: Auth) {
    return createMiddleware<AppEnv>(async (c, next) => {
        const result = await auth.api.getSession({
            headers: c.req.raw.headers,
        });
        if (!result) {
            return c.json({ error: "unauthorized" }, 401);
        }
        c.set("userId", result.user.id);
        c.set("role", result.user.role ?? null);
        await next();
    });
}

/**
 * Must run after `requireUser`.
 */
export const requireAdmin = createMiddleware<AppEnv>(async (c, next) => {
    if (c.get("role") !== "admin") {
        return c.json({ error: "forbidden" }, 403);
    }
    await next();
});
