import { Hono } from "hono";
import { sql } from "kysely";
import { nanoid } from "nanoid";
import {
    type FixedCost,
    type FixedCostInput,
    type FixedCostPatch,
    fixedCostInputSchema,
    fixedCostPatchSchema,
} from "@finances/shared";
import type { DB } from "../db/database.ts";
import type { FixedCostsTable } from "../db/schema.ts";
import type { AppEnv } from "../http/session.ts";
import { validate } from "../http/validate.ts";

function toFixedCost(row: FixedCostsTable): FixedCost {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        amount: Number(row.amount),
        currency: row.currency,
        interval: row.interval,
        categoryId: row.category_id,
        active: row.active === 1,
        startDate: row.start_date,
        endDate: row.end_date,
    };
}

function toColumns(
    input: FixedCostInput,
): Omit<FixedCostsTable, "user_id" | "id">;
function toColumns(patch: FixedCostPatch): Partial<FixedCostsTable>;
function toColumns(patch: FixedCostPatch): Partial<FixedCostsTable> {
    return {
        name: patch.name,
        description: patch.description,
        amount: patch.amount,
        currency: patch.currency,
        interval: patch.interval,
        category_id: patch.categoryId,
        active: patch.active === undefined ? undefined : patch.active ? 1 : 0,
        start_date: patch.startDate,
        end_date: patch.endDate,
    };
}

async function categoryExists(db: DB, userId: string, categoryId: string) {
    const row = await db
        .selectFrom("fixed_cost_categories")
        .select("id")
        .where("user_id", "=", userId)
        .where("id", "=", categoryId)
        .executeTakeFirst();
    return row !== undefined;
}

export function fixedCostRoutes(db: DB) {
    return new Hono<AppEnv>()
        .get("/", async (c) => {
            const rows = await db
                .selectFrom("fixed_costs")
                .selectAll()
                .where("user_id", "=", c.get("userId"))
                .orderBy("name")
                .execute();
            return c.json(rows.map(toFixedCost));
        })
        .get("/monthly-total", async (c) => {
            const { total } = await sql<{ total: number | null }>`
                SELECT SUM(
                    CASE interval
                        WHEN 'monthly'   THEN amount
                        WHEN 'quarterly' THEN amount / 3.0
                        WHEN 'yearly'    THEN amount / 12.0
                    END
                ) AS total
                FROM fixed_costs
                WHERE user_id = ${c.get("userId")}
                  AND active = 1
                  AND start_date <= date('now')
                  AND (end_date IS NULL OR end_date >= date('now'))`
                .execute(db)
                .then((result) => result.rows[0] ?? { total: null });
            return c.json({ total: total ?? 0 });
        })
        .get("/:id", async (c) => {
            const row = await db
                .selectFrom("fixed_costs")
                .selectAll()
                .where("user_id", "=", c.get("userId"))
                .where("id", "=", c.req.param("id"))
                .executeTakeFirst();
            if (!row) {
                return c.json({ error: "not_found" }, 404);
            }
            return c.json(toFixedCost(row));
        })
        .post("/", validate("json", fixedCostInputSchema), async (c) => {
            const userId = c.get("userId");
            const input = c.req.valid("json");
            if (!(await categoryExists(db, userId, input.categoryId))) {
                return c.json({ error: "unknown_category" }, 422);
            }
            const row = await db
                .insertInto("fixed_costs")
                .values({ ...toColumns(input), user_id: userId, id: nanoid(8) })
                .returningAll()
                .executeTakeFirstOrThrow();
            return c.json(toFixedCost(row), 201);
        })
        .patch("/:id", validate("json", fixedCostPatchSchema), async (c) => {
            const userId = c.get("userId");
            const patch = c.req.valid("json");
            if (
                patch.categoryId !== undefined &&
                !(await categoryExists(db, userId, patch.categoryId))
            ) {
                return c.json({ error: "unknown_category" }, 422);
            }
            const columns = Object.fromEntries(
                Object.entries(toColumns(patch)).filter(
                    ([, value]) => value !== undefined,
                ),
            );
            const row =
                Object.keys(columns).length > 0
                    ? await db
                          .updateTable("fixed_costs")
                          .set(columns)
                          .where("user_id", "=", userId)
                          .where("id", "=", c.req.param("id"))
                          .returningAll()
                          .executeTakeFirst()
                    : await db
                          .selectFrom("fixed_costs")
                          .selectAll()
                          .where("user_id", "=", userId)
                          .where("id", "=", c.req.param("id"))
                          .executeTakeFirst();
            if (!row) {
                return c.json({ error: "not_found" }, 404);
            }
            return c.json(toFixedCost(row));
        })
        .delete("/:id", async (c) => {
            const result = await db
                .deleteFrom("fixed_costs")
                .where("user_id", "=", c.get("userId"))
                .where("id", "=", c.req.param("id"))
                .executeTakeFirst();
            if (result.numDeletedRows === 0n) {
                return c.json({ error: "not_found" }, 404);
            }
            return c.body(null, 204);
        });
}
