import { Hono } from "hono";
import { sql } from "kysely";
import {
    type CategorySpending,
    type DailySpike,
    type DailyTotal,
    type MonthlyCategoryTotal,
    spentQuerySchema,
} from "@finances/shared";
import type { DB } from "../db/database.ts";
import type { AppEnv } from "../http/session.ts";
import { validate } from "../http/validate.ts";

// Dates are Unix milliseconds; SQLite date functions work in UTC.
// Exceptional transactions are left out of everything except `spent`.

export function insightRoutes(db: DB) {
    return (
        new Hono<AppEnv>()
            .get("/spent", validate("query", spentQuerySchema), async (c) => {
                const { from, to, kind } = c.req.valid("query");
                const { rows } = await sql<{ total: number | null }>`
                SELECT round(SUM(CASE kind WHEN 'expense' THEN amount ELSE -amount END), 2) AS total
                FROM transactions
                WHERE user_id = ${c.get("userId")}
                  AND date >= ${from}
                  AND date <= ${to}
                  AND (kind = ${kind ?? null} OR ${kind ?? null} IS NULL)`.execute(
                    db,
                );
                const total = rows[0]?.total ?? 0;
                // Income alone is reported as a positive amount.
                return c.json({ total: kind === "income" ? -total : total });
            })
            .get("/trend", async (c) => {
                const { rows } = await sql<DailyTotal>`
                SELECT date(date / 1000, 'unixepoch') AS day,
                       round(SUM(amount), 2)          AS total
                FROM transactions
                WHERE user_id = ${c.get("userId")}
                  AND kind = 'expense'
                  AND exceptional = 0
                  AND date(date / 1000, 'unixepoch') >= date('now', '-30 days')
                GROUP BY day
                ORDER BY day`.execute(db);
                return c.json(rows);
            })
            // The day with the highest spending of a single category in the last
            // 30 days.
            .get("/spike", async (c) => {
                const { rows } = await sql<DailySpike>`
                WITH daily_category_totals AS (SELECT date(t.date / 1000, 'unixepoch') AS day,
                                                      c.name                           AS category_name,
                                                      c.color                          AS category_color,
                                                      SUM(t.amount)                    AS total
                                               FROM transactions t
                                                        JOIN categories c
                                                             ON c.user_id = t.user_id AND c.id = t.category_id
                                               WHERE t.user_id = ${c.get("userId")}
                                                 AND t.kind = 'expense'
                                                 AND t.exceptional = 0
                                                 AND date(t.date / 1000, 'unixepoch') >= date('now', '-30 days')
                                               GROUP BY day, c.id)
                SELECT day,
                       round(total, 2) AS total,
                       category_name   AS categoryName,
                       category_color  AS categoryColor
                FROM daily_category_totals
                ORDER BY total DESC
                LIMIT 1`.execute(db);
                return c.json(rows[0] ?? null);
            })
            // Spending per category in the current month.
            .get("/categories", async (c) => {
                const { rows } = await sql<CategorySpending>`
                SELECT c.id                     AS categoryId,
                       c.name                   AS categoryName,
                       c.color                  AS categoryColor,
                       c.icon_name              AS categoryIconName,
                       round(SUM(t.amount), 2)  AS total,
                       COUNT(t.id)              AS expenseCount,
                       round(AVG(t.amount), 2)  AS averageExpense
                FROM transactions t
                         JOIN categories c ON c.user_id = t.user_id AND c.id = t.category_id
                WHERE t.user_id = ${c.get("userId")}
                  AND t.kind = 'expense'
                  AND t.exceptional = 0
                  AND strftime('%Y-%m', t.date / 1000, 'unixepoch') = strftime('%Y-%m', 'now')
                GROUP BY c.id
                ORDER BY total DESC`.execute(db);
                return c.json(rows);
            })
            .get("/months", async (c) => {
                const { rows } = await sql<MonthlyCategoryTotal>`
                WITH monthly_category_totals AS (SELECT strftime('%Y-%m', date / 1000, 'unixepoch') AS month,
                                                        category_id,
                                                        SUM(amount)                                 AS total
                                                 FROM transactions
                                                 WHERE user_id = ${c.get("userId")}
                                                   AND kind = 'expense'
                                                   AND exceptional = 0
                                                 GROUP BY month, category_id)
                SELECT m.month,
                       c.name          AS categoryName,
                       c.icon_name     AS categoryIconName,
                       round(m.total, 2) AS total
                FROM monthly_category_totals m
                         JOIN categories c ON c.user_id = ${c.get("userId")} AND c.id = m.category_id
                ORDER BY m.month DESC, c.name`.execute(db);
                return c.json(rows);
            })
    );
}
