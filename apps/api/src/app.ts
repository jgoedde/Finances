import { Hono } from "hono";
import type { Auth } from "./auth/auth.ts";
import type { DB } from "./db/database.ts";
import {
    categoryRoutes,
    fixedCostCategoryRoutes,
} from "./features/categories/routes.ts";
import { dataTransferRoutes } from "./features/data-transfer/routes.ts";
import { fixedCostRoutes } from "./features/fixed-costs/routes.ts";
import { insightRoutes } from "./features/insights/routes.ts";
import { adminLinkRoutes, linkRoutes } from "./features/links/routes.ts";
import { transactionRoutes } from "./features/transactions/routes.ts";
import { type AppEnv, requireAdmin, requireUser } from "./http/session.ts";

export function createApp(db: DB, auth: Auth) {
    const app = new Hono<AppEnv>().basePath("/api");

    // Replaces Hono's default handler, which writes to `console.error`; the
    // request logger logs the error (`c.error`) with the request line.
    app.onError((_error, c) => c.text("Internal Server Error", 500));

    // Endpoints take their dependencies from the context.
    app.use(async (c, next) => {
        c.set("db", db);
        c.set("auth", auth);
        await next();
    });

    app.get("/health", (c) => c.json({ ok: true }));
    app.on(["GET", "POST"], "/auth/*", (c) => auth.handler(c.req.raw));
    app.route("/links", linkRoutes);

    const protectedRoutes = {
        "/transactions": transactionRoutes,
        "/categories": categoryRoutes,
        "/fixed-cost-categories": fixedCostCategoryRoutes,
        "/fixed-costs": fixedCostRoutes,
        "/insights": insightRoutes,
        "/data": dataTransferRoutes,
    };
    for (const [path, routes] of Object.entries(protectedRoutes)) {
        app.use(path, requireUser);
        app.use(`${path}/*`, requireUser);
        app.route(path, routes);
    }

    app.use("/admin/*", requireUser, requireAdmin);
    app.route("/admin", adminLinkRoutes);

    return app;
}
