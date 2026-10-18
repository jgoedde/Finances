import type {
    FixedCost,
    FixedCostInput,
    FixedCostPatch,
} from "@finances/shared";
import { z } from "zod";
import type { DB } from "#/db/database.ts";
import type { FixedCostsTable } from "#/db/schema.ts";

export const fixedCostIdParam = z.object({ id: z.string().min(1) });

export function toFixedCost(row: FixedCostsTable): FixedCost {
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

export function toColumns(
    input: FixedCostInput,
): Omit<FixedCostsTable, "user_id" | "id">;
export function toColumns(patch: FixedCostPatch): Partial<FixedCostsTable>;
export function toColumns(patch: FixedCostPatch): Partial<FixedCostsTable> {
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
