import type {
    FixedCost,
    FixedCostAmount,
    FixedCostInput,
    FixedCostPatch,
} from "@finances/shared";
import _ from "lodash";
import { z } from "zod";
import type { DB } from "#/db/database.ts";
import type { FixedCostAmountsTable, FixedCostsTable } from "#/db/schema.ts";

export const fixedCostIdParam = z.object({ id: z.string().min(1) });

/**
 * The user's fixed costs (or the one with `id`) with their amount history,
 * by name.
 */
export async function loadFixedCosts(
    db: DB,
    userId: string,
    id?: string,
): Promise<FixedCost[]> {
    let fixedCosts = db
        .selectFrom("fixed_costs")
        .selectAll()
        .where("user_id", "=", userId);
    let amounts = db
        .selectFrom("fixed_cost_amounts")
        .selectAll()
        .where("user_id", "=", userId);
    if (id !== undefined) {
        fixedCosts = fixedCosts.where("id", "=", id);
        amounts = amounts.where("fixed_cost_id", "=", id);
    }
    const [rows, amountRows] = await Promise.all([
        fixedCosts.orderBy("name").execute(),
        amounts.orderBy("valid_from").execute(),
    ]);
    const amountsById = _.groupBy(amountRows, "fixed_cost_id");
    return rows.map((row) => toFixedCost(row, amountsById[row.id] ?? []));
}

/**
 * The user's fixed cost with `id` with its amount history.
 */
export async function loadFixedCost(
    db: DB,
    userId: string,
    id: string,
): Promise<FixedCost | undefined> {
    return (await loadFixedCosts(db, userId, id))[0];
}

function toFixedCost(
    row: FixedCostsTable,
    amounts: FixedCostAmountsTable[],
): FixedCost {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        currency: row.currency,
        categoryId: row.category_id,
        startDate: row.start_date,
        endDate: row.end_date,
        amounts: amounts.map((it) => ({
            validFrom: it.valid_from,
            amount: Number(it.amount),
            interval: it.interval,
        })),
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
        currency: patch.currency,
        category_id: patch.categoryId,
        start_date: patch.startDate,
        end_date: patch.endDate,
    };
}

export function toAmountRows(
    userId: string,
    fixedCostId: string,
    amounts: FixedCostAmount[],
): FixedCostAmountsTable[] {
    return amounts.map((it) => ({
        user_id: userId,
        fixed_cost_id: fixedCostId,
        valid_from: it.validFrom,
        amount: it.amount,
        interval: it.interval,
    }));
}

/**
 * Replaces the fixed cost's amount history.
 */
export async function replaceAmounts(
    db: DB,
    userId: string,
    fixedCostId: string,
    amounts: FixedCostAmount[],
): Promise<void> {
    await db
        .deleteFrom("fixed_cost_amounts")
        .where("user_id", "=", userId)
        .where("fixed_cost_id", "=", fixedCostId)
        .execute();
    await db
        .insertInto("fixed_cost_amounts")
        .values(toAmountRows(userId, fixedCostId, amounts))
        .execute();
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
