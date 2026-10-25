import type { DataExport, ImportResult } from "@finances/shared";
import type { DB } from "#/db/database.ts";
import {
    arePriceChangesInRange,
    readFixedCosts,
} from "#/features/fixed-costs/fixed-costs.ts";
import {
    toLocationColumns,
    toTransaction,
} from "#/features/transactions/transactions.ts";

/**
 * All of the user's data in the export format.
 */
export async function readExport(db: DB, userId: string): Promise<DataExport> {
    const [categories, fixedCostCategories, fixedCosts, transactions] =
        await Promise.all([
            db
                .selectFrom("categories")
                .selectAll()
                .where("user_id", "=", userId)
                .orderBy("id")
                .execute(),
            db
                .selectFrom("fixed_cost_categories")
                .selectAll()
                .where("user_id", "=", userId)
                .orderBy("id")
                .execute(),
            readFixedCosts(db, userId),
            db
                .selectFrom("transactions")
                .selectAll()
                .where("user_id", "=", userId)
                .orderBy("date")
                .execute(),
        ]);

    return {
        format: "finances-export",
        version: 4,
        exportedAt: new Date().toISOString(),
        categories: categories.map((c) => ({
            id: c.id,
            name: c.name,
            color: c.color,
            iconName: c.icon_name,
        })),
        fixedCostCategories: fixedCostCategories.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
        })),
        fixedCosts,
        transactions: transactions.map(toTransaction),
    };
}

/**
 * Only an account without transactions and fixed costs can import.
 */
export async function hasData(db: DB, userId: string): Promise<boolean> {
    const [transaction, fixedCost] = await Promise.all([
        db
            .selectFrom("transactions")
            .select("id")
            .where("user_id", "=", userId)
            .limit(1)
            .executeTakeFirst(),
        db
            .selectFrom("fixed_costs")
            .select("id")
            .where("user_id", "=", userId)
            .limit(1)
            .executeTakeFirst(),
    ]);
    return transaction !== undefined || fixedCost !== undefined;
}

export class InvalidReferenceError extends Error {}

export class PriceChangeOutOfRangeError extends Error {}

/**
 * Replaces all of the user's data with the import, atomically. Callers decide
 * whether an account with data may be replaced.
 */
export async function replaceData(
    db: DB,
    userId: string,
    data: DataExport,
): Promise<ImportResult> {
    const categoryIds = new Set(data.categories.map((c) => c.id));
    const fixedCostCategoryIds = new Set(
        data.fixedCostCategories.map((c) => c.id),
    );
    if (
        data.transactions.some((t) => !categoryIds.has(t.categoryId)) ||
        data.fixedCosts.some((f) => !fixedCostCategoryIds.has(f.categoryId))
    ) {
        throw new InvalidReferenceError();
    }
    if (!data.fixedCosts.every(arePriceChangesInRange)) {
        throw new PriceChangeOutOfRangeError();
    }

    const now = Date.now();
    await db.transaction().execute(async (trx) => {
        // Tombstones are dropped too, so imported ids can be written even if
        // they were deleted before (e.g. importing the same backup again).
        // Fixed costs and transactions go first: they reference categories.
        for (const table of [
            "transactions",
            "transaction_tombstones",
            "fixed_costs",
        ] as const) {
            await trx.deleteFrom(table).where("user_id", "=", userId).execute();
        }
        await trx
            .deleteFrom("categories")
            .where("user_id", "=", userId)
            .execute();
        await trx
            .deleteFrom("fixed_cost_categories")
            .where("user_id", "=", userId)
            .execute();

        // SQLite limits bound parameters per statement; insert in chunks.
        const insertChunked = async <T>(
            items: T[],
            insert: (chunk: T[]) => Promise<unknown>,
        ) => {
            for (let i = 0; i < items.length; i += 500) {
                await insert(items.slice(i, i + 500));
            }
        };

        await insertChunked(data.categories, (chunk) =>
            trx
                .insertInto("categories")
                .values(
                    chunk.map((c) => ({
                        user_id: userId,
                        id: c.id,
                        name: c.name,
                        color: c.color,
                        icon_name: c.iconName,
                    })),
                )
                .execute(),
        );
        await insertChunked(data.fixedCostCategories, (chunk) =>
            trx
                .insertInto("fixed_cost_categories")
                .values(
                    chunk.map((c) => ({
                        user_id: userId,
                        id: c.id,
                        name: c.name,
                        description: c.description,
                    })),
                )
                .execute(),
        );
        await insertChunked(data.fixedCosts, (chunk) =>
            trx
                .insertInto("fixed_costs")
                .values(
                    chunk.map((f) => ({
                        user_id: userId,
                        id: f.id,
                        name: f.name,
                        description: f.description,
                        initial_amount: f.initialAmount,
                        currency: f.currency,
                        interval: f.interval,
                        category_id: f.categoryId,
                        active: f.active ? 1 : 0,
                        start_date: f.startDate,
                        end_date: f.endDate,
                    })),
                )
                .execute(),
        );
        await insertChunked(
            data.fixedCosts.flatMap((f) =>
                f.priceChanges.map((change) => ({
                    user_id: userId,
                    fixed_cost_id: f.id,
                    date: change.date,
                    amount: change.amount,
                })),
            ),
            (chunk) =>
                trx
                    .insertInto("fixed_cost_price_changes")
                    .values(chunk)
                    .execute(),
        );
        await insertChunked(data.transactions, (chunk) =>
            trx
                .insertInto("transactions")
                .values(
                    chunk.map((t) => ({
                        user_id: userId,
                        id: t.id,
                        date: t.date,
                        counterparty: t.counterparty,
                        description: t.description,
                        kind: t.kind,
                        amount: t.amount,
                        currency: t.currency,
                        category_id: t.categoryId,
                        exceptional: t.exceptional ? 1 : 0,
                        ...toLocationColumns(t.location),
                        updated_at: now,
                    })),
                )
                .execute(),
        );
    });

    return {
        categories: data.categories.length,
        fixedCosts: data.fixedCosts.length,
        transactions: data.transactions.length,
    };
}
