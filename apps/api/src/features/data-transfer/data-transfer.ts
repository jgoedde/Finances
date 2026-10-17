import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import {
    type DataExport,
    type ImportResult,
    dataExportSchema,
} from "@finances/shared";
import type { DB } from "../../db/database.ts";
import type { AppEnv } from "../../http/session.ts";
import { toFixedCost } from "../fixed-costs.ts";
import { toTransaction } from "../transactions.ts";
import { isSqliteFile, readLegacyDatabase } from "./legacy-database.ts";

const MAX_IMPORT_BYTES = 50 * 1024 * 1024;

async function exportData(db: DB, userId: string): Promise<DataExport> {
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
            db
                .selectFrom("fixed_costs")
                .selectAll()
                .where("user_id", "=", userId)
                .orderBy("id")
                .execute(),
            db
                .selectFrom("transactions")
                .selectAll()
                .where("user_id", "=", userId)
                .orderBy("date")
                .execute(),
        ]);

    return {
        format: "finances-export",
        version: 1,
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
        fixedCosts: fixedCosts.map(toFixedCost),
        transactions: transactions.map(toTransaction),
    };
}

/** Only an account without transactions and fixed costs can import. */
async function hasData(db: DB, userId: string): Promise<boolean> {
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

class InvalidReferenceError extends Error {}

/**
 * Replaces all of the user's data with the import, atomically. Callers decide
 * whether an account with data may be replaced.
 */
async function importData(
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
                        amount: f.amount,
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
        await insertChunked(data.transactions, (chunk) =>
            trx
                .insertInto("transactions")
                .values(
                    chunk.map((t) => ({
                        user_id: userId,
                        id: t.id,
                        date: t.date,
                        name: t.name,
                        description: t.description,
                        kind: t.kind,
                        amount: t.amount,
                        currency: t.currency,
                        category_id: t.categoryId,
                        exceptional: t.exceptional ? 1 : 0,
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

function parseUpload(bytes: Uint8Array): unknown {
    if (isSqliteFile(bytes)) {
        return readLegacyDatabase(bytes);
    }
    return JSON.parse(new TextDecoder().decode(bytes));
}

export function dataTransferRoutes(db: DB) {
    return (
        new Hono<AppEnv>()
            .get("/export", async (c) => {
                const data = await exportData(db, c.get("userId"));
                const date = data.exportedAt.slice(0, 10);
                c.header(
                    "Content-Disposition",
                    `attachment; filename="finances-${date}.json"`,
                );
                return c.json(data);
            })
            // Body: a JSON export or a legacy `.db` file, as raw bytes. An
            // account with data is only replaced with `?replace=true`.
            .post(
                "/import",
                bodyLimit({
                    maxSize: MAX_IMPORT_BYTES,
                    onError: (c) => c.json({ error: "file_too_large" }, 413),
                }),
                async (c) => {
                    const userId = c.get("userId");
                    const replace = c.req.query("replace") === "true";
                    if (!replace && (await hasData(db, userId))) {
                        return c.json({ error: "account_not_empty" }, 409);
                    }

                    let upload: unknown;
                    try {
                        upload = parseUpload(
                            new Uint8Array(await c.req.arrayBuffer()),
                        );
                    } catch {
                        return c.json({ error: "unreadable_file" }, 422);
                    }

                    const parsed = dataExportSchema.safeParse(upload);
                    if (!parsed.success) {
                        return c.json(
                            {
                                error: "invalid_file",
                                issues: parsed.error.issues,
                            },
                            422,
                        );
                    }

                    try {
                        return c.json(
                            await importData(db, userId, parsed.data),
                        );
                    } catch (error) {
                        if (error instanceof InvalidReferenceError) {
                            return c.json({ error: "unknown_category" }, 422);
                        }
                        throw error;
                    }
                },
            )
    );
}
