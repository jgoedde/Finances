import { Hono } from "hono";
import { z } from "zod";
import {
    type Transaction,
    transactionIdSchema,
    transactionInputSchema,
    transactionListQuerySchema,
} from "@finances/shared";
import type { DB } from "../db/database.ts";
import type { TransactionsTable } from "../db/schema.ts";
import type { AppEnv } from "../http/session.ts";
import { validate } from "../http/validate.ts";

const idParam = z.object({ id: transactionIdSchema });

function toTransaction(row: TransactionsTable): Transaction {
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
            .get("/count", async (c) => {
                const { count } = await db
                    .selectFrom("transactions")
                    .select((eb) => eb.fn.countAll<number>().as("count"))
                    .where("user_id", "=", c.get("userId"))
                    .executeTakeFirstOrThrow();
                return c.json({ count });
            })
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
