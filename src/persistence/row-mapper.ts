import type { Database } from "sql.js";
import type { FixedCostRecord } from "@/persistence/repositories/fixed-costs-repository.ts";
import type {
    FixedCost,
    FixedCostCategory,
    TransactionWithCategory,
} from "@/persistence/types.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowsFromResult<T = any>(
    result: ReturnType<Database["exec"]>,
): T[] {
    if (result.length === 0 || !result[0]) return [];
    const { columns, values } = result[0];
    return values.map((row) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: any = {};
        columns.forEach((col, i) => {
            obj[col] = row[i];
        });
        return obj as T;
    });
}
// Mapper
const INTERVAL_DIVISOR: Record<FixedCost["interval"], number> = {
    monthly: 1,
    quarterly: 3,
    yearly: 12,
};

export function toFixedCost(
    row: FixedCostRecord,
    category: FixedCostCategory,
): FixedCost {
    const startDate = new Date(row.start_date);
    const endDate = row.end_date ? new Date(row.end_date) : null;
    const now = new Date();

    const monthlyAmount = row.amount / INTERVAL_DIVISOR[row.interval];

    return {
        id: row.id,
        name: row.name,
        description: row.description ?? undefined,
        amount: row.amount,
        currency: row.currency,
        interval: row.interval,
        category,
        active: row.active === 1,
        startDate,
        endDate,
        monthlyAmount,
        yearlyAmount: monthlyAmount * 12,
        isRunning:
            row.active === 1 &&
            startDate <= now &&
            (endDate === null || endDate >= now),
    };
}

// For inserts/updates — no id, no derived fields
export type FixedCostPayload = Omit<FixedCostRecord, "id">;

export function mapExpenseWithCategory(
    row: Record<string, unknown>,
): TransactionWithCategory {
    return {
        id: row.id as string,
        date: row.date as number,
        name: row.name as string,
        description: row.description as string,
        amount: Number(row.amount),
        currency: row.currency as string,
        category_id: row.category_id as number,
        exceptional: Boolean(row.exceptional),
        category: {
            id: row.category_id as number,
            name: row.category_name as string,
            color: row.category_color as string,
            icon_name: row.category_icon_name as string,
        },
    };
}
