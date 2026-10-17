import { Hono } from "hono";
import { sql } from "kysely";
import { z } from "zod";
import {
    type Transaction,
    type TransactionSearchPage,
    transactionIdSchema,
    transactionInputSchema,
    transactionListQuerySchema,
    transactionSearchQuerySchema,
} from "@finances/shared";
import type { DB } from "../db/database.ts";
import type { TransactionsTable } from "../db/schema.ts";
import type { AppEnv } from "../http/session.ts";
import { validate } from "../http/validate.ts";

const idParam = z.object({ id: transactionIdSchema });

export function toTransaction(row: TransactionsTable): Transaction {
    return {
        id: row.id,
        date: row.date,
        name: row.name,
        description: row.description,
        kind: row.kind,
        amount: Number(row.amount),
        currency: row.currency,
        categoryId: row.category_id,
        exceptional: row.exceptional === 1,
    };
}

/** Wraps a search term in `%` and escapes `%`, `_` and the backslash. */
function toLikePattern(term: string): string {
    return `%${term.replace(/[\\%_]/g, "\\$&")}%`;
}

export function transactionRoutes(db: DB) {
    return (
        new Hono<AppEnv>()
            .get(
                "/",
                validate("query", transactionListQuerySchema),
                async (c) => {
                    const query = c.req.valid("query");
                    let select = db
                        .selectFrom("transactions")
                        .selectAll()
                        .where("user_id", "=", c.get("userId"))
                        .where("date", ">=", query.from)
                        .where("date", "<=", query.to);
                    if (query.categoryId) {
                        select = select.where(
                            "category_id",
                            "=",
                            query.categoryId,
                        );
                    }
                    if (query.kind) {
                        select = select.where("kind", "=", query.kind);
                    }
                    if (query.excludeExceptional) {
                        select = select.where("exceptional", "=", 0);
                    }
                    const rows = await select.orderBy("date", "desc").execute();
                    return c.json(rows.map(toTransaction));
                },
            )
            // Newest first, paginated by a `(date, id)` cursor. LIKE folds
            // case for ASCII only, so umlauts match case-sensitively.
            .get(
                "/search",
                validate("query", transactionSearchQuerySchema),
                async (c) => {
                    const { q, olderThan, cursor, limit } =
                        c.req.valid("query");
                    let select = db
                        .selectFrom("transactions")
                        .selectAll()
                        .where("user_id", "=", c.get("userId"));
                    const term = q?.trim();
                    if (term) {
                        const pattern = toLikePattern(term);
                        select = select.where((eb) =>
                            eb.or([
                                sql<boolean>`name LIKE ${pattern} ESCAPE '\\'`,
                                sql<boolean>`description LIKE ${pattern} ESCAPE '\\'`,
                            ]),
                        );
                    }
                    if (olderThan !== undefined) {
                        select = select.where("date", "<", olderThan);
                    }
                    if (cursor) {
                        select = select.where((eb) =>
                            eb.or([
                                eb("date", "<", cursor.date),
                                eb.and([
                                    eb("date", "=", cursor.date),
                                    eb("id", "<", cursor.id),
                                ]),
                            ]),
                        );
                    }
                    // One extra row tells whether there is another page.
                    const rows = await select
                        .orderBy("date", "desc")
                        .orderBy("id", "desc")
                        .limit(limit + 1)
                        .execute();
                    const items = rows.slice(0, limit).map(toTransaction);
                    const last = items.at(-1);
                    const page: TransactionSearchPage = {
                        items,
                        nextCursor:
                            rows.length > limit && last
                                ? `${last.date}:${last.id}`
                                : null,
                    };
                    return c.json(page);
                },
            )
            .get("/:id", validate("param", idParam), async (c) => {
                const row = await db
                    .selectFrom("transactions")
                    .selectAll()
                    .where("user_id", "=", c.get("userId"))
                    .where("id", "=", c.req.valid("param").id)
                    .executeTakeFirst();
                if (!row) {
                    return c.json({ error: "not_found" }, 404);
                }
                return c.json(toTransaction(row));
            })
            // Create or replace (last write wins). Idempotent, so offline
            // clients can replay it. Writes to a deleted id are ignored.
            .put(
                "/:id",
                validate("param", idParam),
                validate("json", transactionInputSchema),
                async (c) => {
                    const userId = c.get("userId");
                    const { id } = c.req.valid("param");
                    const input = c.req.valid("json");

                    return db.transaction().execute(async (trx) => {
                        const tombstone = await trx
                            .selectFrom("transaction_tombstones")
                            .select("id")
                            .where("user_id", "=", userId)
                            .where("id", "=", id)
                            .executeTakeFirst();
                        if (tombstone) {
                            return c.body(null, 204);
                        }

                        const category = await trx
                            .selectFrom("categories")
                            .select("id")
                            .where("user_id", "=", userId)
                            .where("id", "=", input.categoryId)
                            .executeTakeFirst();
                        if (!category) {
                            return c.json({ error: "unknown_category" }, 422);
                        }

                        const values = {
                            date: input.date,
                            name: input.name,
                            description: input.description,
                            kind: input.kind,
                            amount: input.amount,
                            currency: input.currency,
                            category_id: input.categoryId,
                            exceptional: input.exceptional ? 1 : 0,
                            updated_at: Date.now(),
                        } as const;

                        const row = await trx
                            .insertInto("transactions")
                            .values({ user_id: userId, id, ...values })
                            .onConflict((oc) =>
                                oc
                                    .columns(["user_id", "id"])
                                    .doUpdateSet(values),
                            )
                            .returningAll()
                            .executeTakeFirstOrThrow();
                        return c.json(toTransaction(row));
                    });
                },
            )
            // Idempotent: deleting an unknown or already deleted id succeeds.
            .delete("/:id", validate("param", idParam), async (c) => {
                const userId = c.get("userId");
                const { id } = c.req.valid("param");
                await db.transaction().execute(async (trx) => {
                    await trx
                        .deleteFrom("transactions")
                        .where("user_id", "=", userId)
                        .where("id", "=", id)
                        .execute();
                    await trx
                        .insertInto("transaction_tombstones")
                        .values({ user_id: userId, id, deleted_at: Date.now() })
                        .onConflict((oc) => oc.doNothing())
                        .execute();
                });
                return c.body(null, 204);
            })
    );
}
