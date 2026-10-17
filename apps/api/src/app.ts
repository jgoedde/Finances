import { Hono } from "hono";
import type { Auth } from "./auth/auth.ts";
import type { DB } from "./db/database.ts";
import {
    categoryRoutes,
    fixedCostCategoryRoutes,
} from "./features/categories.ts";
import { fixedCostRoutes } from "./features/fixed-costs.ts";
import { insightRoutes } from "./features/insights.ts";
import { adminInviteRoutes, inviteRoutes } from "./features/invites.ts";
import { transactionRoutes } from "./features/transactions.ts";
import { type AppEnv, requireAdmin, requireUser } from "./http/session.ts";

export function createApp(db: DB, auth: Auth) {
    const app = new Hono<AppEnv>().basePath("/api");
    const userOnly = requireUser(auth);

    app.get("/health", (c) => c.json({ ok: true }));
    app.on(["GET", "POST"], "/auth/*", (c) => auth.handler(c.req.raw));
    app.route("/invites", inviteRoutes(db, auth));

    const protectedRoutes = {
        "/transactions": transactionRoutes(db),
        "/categories": categoryRoutes(db),
        "/fixed-cost-categories": fixedCostCategoryRoutes(db),
        "/fixed-costs": fixedCostRoutes(db),
        "/insights": insightRoutes(db),
    };
    for (const [path, routes] of Object.entries(protectedRoutes)) {
        app.use(path, userOnly);
        app.use(`${path}/*`, userOnly);
        app.route(path, routes);
    }

    app.use("/admin/*", userOnly, requireAdmin);
    app.route("/admin/invites", adminInviteRoutes(db));

    return app;
}
