import type {
    FixedCost,
    FixedCostInput,
    FixedCostPatch,
    PriceChange,
} from "@finances/shared";
import _ from "lodash";
import { z } from "zod";
import type { DB } from "#/db/database.ts";
import type { FixedCostsTable } from "#/db/schema.ts";

export const fixedCostIdParam = z.object({ id: z.string().min(1) });

/**
 * The user's fixed costs (or only the one with `id`) with their price
 * changes, by name.
 */
export async function readFixedCosts(
    db: DB,
    userId: string,
    id?: string,
): Promise<FixedCost[]> {
    let fixedCosts = db
        .selectFrom("fixed_costs")
        .selectAll()
        .where("user_id", "=", userId);
    let priceChanges = db
        .selectFrom("fixed_cost_price_changes")
        .select(["fixed_cost_id", "date", "amount"])
        .where("user_id", "=", userId);
    if (id !== undefined) {
        fixedCosts = fixedCosts.where("id", "=", id);
        priceChanges = priceChanges.where("fixed_cost_id", "=", id);
    }
    const [rows, priceChangeRows] = await Promise.all([
        fixedCosts.orderBy("name").orderBy("id").execute(),
        priceChanges.orderBy("date").execute(),
    ]);
    const priceChangesById = _.groupBy(priceChangeRows, "fixed_cost_id");
    return rows.map((row) =>
        toFixedCost(
            row,
            (priceChangesById[row.id] ?? []).map((change) => ({
                date: change.date,
                amount: Number(change.amount),
            })),
        ),
    );
}

/**
 * The user's fixed cost with `id` and its price changes, if it exists.
 */
export async function readFixedCost(
    db: DB,
    userId: string,
    id: string,
): Promise<FixedCost | undefined> {
    const [fixedCost] = await readFixedCosts(db, userId, id);
    return fixedCost;
}

/**
 * Replaces the fixed cost's price changes.
 */
export async function writePriceChanges(
    db: DB,
    userId: string,
    fixedCostId: string,
    priceChanges: PriceChange[],
): Promise<void> {
    await db
        .deleteFrom("fixed_cost_price_changes")
        .where("user_id", "=", userId)
        .where("fixed_cost_id", "=", fixedCostId)
        .execute();
    if (priceChanges.length > 0) {
        await db
            .insertInto("fixed_cost_price_changes")
            .values(
                priceChanges.map((change) => ({
                    user_id: userId,
                    fixed_cost_id: fixedCostId,
                    date: change.date,
                    amount: change.amount,
                })),
            )
            .execute();
    }
}

/**
 * Whether every price change is after the start date and on or before the
 * end date.
 */
export function arePriceChangesInRange({
    startDate,
    endDate,
    priceChanges,
}: Pick<FixedCost, "startDate" | "endDate" | "priceChanges">): boolean {
    return priceChanges.every(
        (change) =>
            change.date > startDate &&
            (endDate === null || change.date <= endDate),
    );
}

function toFixedCost(
    row: FixedCostsTable,
    priceChanges: PriceChange[],
): FixedCost {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        initialAmount: Number(row.initial_amount),
        priceChanges,
        currency: row.currency,
        interval: row.interval,
        categoryId: row.category_id,
        active: row.active === 1,
        startDate: row.start_date,
        endDate: row.end_date,
    };
}

export function toColumns(
    input: FixedCostInput,
): Omit<FixedCostsTable, "user_id" | "id">;
export function toColumns(patch: FixedCostPatch): Partial<FixedCostsTable>;
export function toColumns(patch: FixedCostPatch): Partial<FixedCostsTable> {
    return {
        name: patch.name,
        description: patch.description,
        initial_amount: patch.initialAmount,
        currency: patch.currency,
        interval: patch.interval,
        category_id: patch.categoryId,
        active: patch.active === undefined ? undefined : patch.active ? 1 : 0,
        start_date: patch.startDate,
        end_date: patch.endDate,
    };
}

export async function categoryExists(
    db: DB,
    userId: string,
    categoryId: string,
) {
    const row = await db
        .selectFrom("fixed_cost_categories")
        .select("id")
        .where("user_id", "=", userId)
        .where("id", "=", categoryId)
        .executeTakeFirst();
    return row !== undefined;
}
