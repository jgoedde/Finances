import { Hono } from "hono";
import {
    type CategoryOverview,
    getMonthlyAmount,
    type MonthOverview,
    netSpending,
    overviewQuerySchema,
    toIsoDate,
} from "@finances/shared";
import type { DB } from "../db/database.ts";
import type { AppEnv } from "../http/session.ts";
import { validate } from "../http/validate.ts";
import { toFixedCost } from "./fixed-costs.ts";

/**
 * Months in the trend, ending with the selected one.
 */
const TREND_MONTHS = 12;
/**
 * Complete months before the selected one that make up the typical month.
 */
const TYPICAL_MONTHS = 6;
/**
 * Covers every time zone's offset from UTC when narrowing by date.
 */
const MAX_OFFSET_MS = 2 * 24 * 60 * 60 * 1000;

/**
 * `YYYY-MM` shifted by `by` months.
 */
function shiftMonth(month: string, by: number): string {
    const [year, monthIndex] = month.split("-").map(Number);
    return new Date(Date.UTC(year!, monthIndex! - 1 + by, 1))
        .toISOString()
        .slice(0, 7);
}

/**
 * Unix ms of the first instant of the month in UTC.
 */
function monthStartUtc(month: string): number {
    return Date.parse(`${month}-01T00:00:00Z`);
}

function lastDayOf(month: string): string {
    const end = new Date(monthStartUtc(shiftMonth(month, 1)) - 1);
    return end.toISOString().slice(0, 10);
}

function median(values: number[]): number | null {
    if (values.length === 0) {
        return null;
    }
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 1
        ? sorted[middle]!
        : (sorted[middle - 1]! + sorted[middle]!) / 2;
}

function round(value: number): number {
    return Math.round(value * 100) / 100;
}

interface BucketedTransaction {
    month: string;
    dayOfMonth: number;
    categoryId: string;
    netSpending: number;
    kind: "expense" | "income";
    amount: number;
    exceptional: boolean;
}

export function insightRoutes(db: DB) {
    return new Hono<AppEnv>().get(
        "/overview",
        validate("query", overviewQuerySchema),
        async (c) => {
            const { month, timeZone } = c.req.valid("query");
            const userId = c.get("userId");

            const firstMonth = shiftMonth(month, -(TREND_MONTHS - 1));
            const rows = await db
                .selectFrom("transactions")
                .select([
                    "date",
                    "kind",
                    "amount",
                    "exceptional",
                    "category_id",
                ])
                .where("user_id", "=", userId)
                .where("date", ">=", monthStartUtc(firstMonth) - MAX_OFFSET_MS)
                .where(
                    "date",
                    "<",
                    monthStartUtc(shiftMonth(month, 1)) + MAX_OFFSET_MS,
                )
                .execute();
            const transactions: BucketedTransaction[] = rows.map((row) => {
                const day = toIsoDate(row.date, timeZone);
                return {
                    month: day.slice(0, 7),
                    dayOfMonth: Number(day.slice(8)),
                    categoryId: row.category_id,
                    kind: row.kind,
                    amount: row.amount,
                    exceptional: row.exceptional === 1,
                    netSpending: netSpending({
                        kind: row.kind,
                        amount: row.amount,
                    }),
                };
            });
            const inMonth = transactions.filter((t) => t.month === month);
            const typicalSpending = transactions.filter((t) => !t.exceptional);

            // A month in progress is compared up to today.
            const today = toIsoDate(Date.now(), timeZone);
            const day =
                today.slice(0, 7) === month ? Number(today.slice(8)) : null;
            const upToDay = (t: BucketedTransaction) =>
                day === null || t.dayOfMonth <= day;

            // Complete months before this one, if they have transactions.
            const history = Array.from({ length: TYPICAL_MONTHS }, (_, i) =>
                shiftMonth(month, -(i + 1)),
            ).filter((m) => transactions.some((t) => t.month === m));
            const sum = (list: BucketedTransaction[]) =>
                list.reduce((total, t) => total + t.netSpending, 0);
            const typicalOf = (
                matches: (t: BucketedTransaction) => boolean,
            ) => {
                const typical = median(
                    history.map((m) =>
                        sum(
                            typicalSpending.filter(
                                (t) =>
                                    t.month === m && upToDay(t) && matches(t),
                            ),
                        ),
                    ),
                );
                return typical === null ? null : round(typical);
            };

            const categoryIds = new Set(
                typicalSpending
                    .filter(
                        (t) => t.month === month || history.includes(t.month),
                    )
                    .map((t) => t.categoryId),
            );
            const categoryRows =
                categoryIds.size === 0
                    ? []
                    : await db
                          .selectFrom("categories")
                          .select(["id", "name", "color", "icon_name"])
                          .where("user_id", "=", userId)
                          .where("id", "in", [...categoryIds])
                          .execute();
            const categories: CategoryOverview[] = categoryRows
                .map((category) => ({
                    categoryId: category.id,
                    categoryName: category.name,
                    categoryColor: category.color,
                    categoryIconName: category.icon_name,
                    total: round(
                        sum(
                            typicalSpending.filter(
                                (t) =>
                                    t.month === month &&
                                    t.categoryId === category.id,
                            ),
                        ),
                    ),
                    typical: typicalOf((t) => t.categoryId === category.id),
                }))
                .filter(({ total, typical }) => total !== 0 || !!typical)
                .sort((a, b) => b.total - a.total);

            const firstDay = `${month}-01`;
            const lastDay = lastDayOf(month);
            const fixedCosts = (
                await db
                    .selectFrom("fixed_costs")
                    .selectAll()
                    .where("user_id", "=", userId)
                    .execute()
            )
                .map(toFixedCost)
                // Running on at least one day of the month.
                .filter(
                    (fixedCost) =>
                        fixedCost.active &&
                        fixedCost.startDate <= lastDay &&
                        (fixedCost.endDate === null ||
                            fixedCost.endDate >= firstDay),
                )
                .reduce(
                    (total, fixedCost) => total + getMonthlyAmount(fixedCost),
                    0,
                );

            const exceptional = inMonth.filter((t) => t.exceptional);
            const overview: MonthOverview = {
                netSpending: round(sum(inMonth)),
                income: round(
                    inMonth
                        .filter((t) => t.kind === "income")
                        .reduce((total, t) => total + t.amount, 0),
                ),
                expenses: round(
                    inMonth
                        .filter((t) => t.kind === "expense")
                        .reduce((total, t) => total + t.amount, 0),
                ),
                exceptional: {
                    count: exceptional.length,
                    netSpending: round(sum(exceptional)),
                },
                pace: {
                    day,
                    netSpending: round(
                        sum(
                            typicalSpending.filter(
                                (t) => t.month === month && upToDay(t),
                            ),
                        ),
                    ),
                    typical: typicalOf(() => true),
                },
                fixedCosts: round(fixedCosts),
                categories,
                trend: Array.from({ length: TREND_MONTHS }, (_, i) => {
                    const m = shiftMonth(firstMonth, i);
                    return {
                        month: m,
                        total: round(
                            sum(typicalSpending.filter((t) => t.month === m)),
                        ),
                    };
                }),
            };
            return c.json(overview);
        },
    );
}
