import { Hono } from "hono";
import type { Category, FixedCostCategory } from "@finances/shared";
import type { DB } from "../db/database.ts";
import type { AppEnv } from "../http/session.ts";

export function categoryRoutes(db: DB) {
    return new Hono<AppEnv>().get("/", async (c) => {
        const rows = await db
            .selectFrom("categories")
            .selectAll()
            .where("user_id", "=", c.get("userId"))
            .orderBy("name")
            .execute();
        return c.json(
            rows.map((row): Category => ({
                id: row.id,
                name: row.name,
                color: row.color,
                iconName: row.icon_name,
            })),
        );
    });
}

export function fixedCostCategoryRoutes(db: DB) {
    return new Hono<AppEnv>().get("/", async (c) => {
        const rows = await db
            .selectFrom("fixed_cost_categories")
            .selectAll()
            .where("user_id", "=", c.get("userId"))
            .orderBy("name")
            .execute();
        return c.json(
            rows.map((row): FixedCostCategory => ({
                id: row.id,
                name: row.name,
                description: row.description,
            })),
        );
    });
}
