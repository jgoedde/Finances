import { createMiddleware } from "hono/factory";
import { routePath } from "hono/route";
import type { Logger } from "pino";
import type { AppEnv } from "./session.ts";

/**
 * Logs one line per request. Only picks safe fields: never headers, bodies or
 * the query string, and paths with parameters (like `/links/:token`) are
 * logged as their route pattern, so tokens stay out of the log.
 */
export function requestLogger(logger: Logger) {
    return createMiddleware<AppEnv>(async (c, next) => {
        const start = performance.now();
        await next();
        // After `next()` the route index points at the responding handler.
        const route = routePath(c);
        const status = c.res.status;
        const line = {
            method: c.req.method,
            path: route.includes(":") ? route : c.req.path,
            status,
            durationMs: Math.round(performance.now() - start),
            userId: c.get("userId"),
            err: c.error,
        };
        if (status >= 500) {
            logger.error(line, "request failed");
        } else {
            logger.info(line, "request");
        }
    });
}
