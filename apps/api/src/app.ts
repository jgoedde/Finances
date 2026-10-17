import { Hono } from "hono";
import type { Auth } from "./auth/auth.ts";
import type { DB } from "./db/database.ts";
import {
    categoryRoutes,
    fixedCostCategoryRoutes,
} from "./features/categories.ts";
import { dataTransferRoutes } from "./features/data-transfer/data-transfer.ts";
import { fixedCostRoutes } from "./features/fixed-costs.ts";
import { insightRoutes } from "./features/insights.ts";
import { adminLinkRoutes, linkRoutes } from "./features/links.ts";
import { transactionRoutes } from "./features/transactions.ts";
import { type AppEnv, requireAdmin, requireUser } from "./http/session.ts";

export function createApp(db: DB, auth: Auth) {
    const app = new Hono<AppEnv>().basePath("/api");
    const userOnly = requireUser(auth);

    app.get("/health", (c) => c.json({ ok: true }));
    app.on(["GET", "POST"], "/auth/*", (c) => auth.handler(c.req.raw));
    app.route("/links", linkRoutes(db, auth));

    const protectedRoutes = {
        "/transactions": transactionRoutes(db),
        "/categories": categoryRoutes(db),
        "/fixed-cost-categories": fixedCostCategoryRoutes(db),
        "/fixed-costs": fixedCostRoutes(db),
        "/insights": insightRoutes(db),
        "/data": dataTransferRoutes(db),
    };
    for (const [path, routes] of Object.entries(protectedRoutes)) {
        app.use(path, userOnly);
        app.use(`${path}/*`, userOnly);
        app.route(path, routes);
    }

    app.use("/admin/*", userOnly, requireAdmin);
    app.route("/admin", adminLinkRoutes(db));

    return app;
}
