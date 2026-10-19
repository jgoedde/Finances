import { sql } from "kysely";
import {
    type TransactionSearchPage,
    transactionSearchQuerySchema,
} from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    toLikePattern,
    toTransaction,
} from "#/features/transactions/transactions.ts";

/**
 * Newest first, paginated by a `(date, id)` cursor. LIKE folds case for
 * ASCII only, so umlauts match case-sensitively.
 */
export const searchTransactions = factory.createHandlers(
    validate("query", transactionSearchQuerySchema),
    async (c) => {
        const { q, olderThan, cursor, limit } = c.req.valid("query");
        let select = c.var.db
            .selectFrom("transactions")
            .selectAll()
            .where("user_id", "=", c.var.userId);
        const term = q?.trim();
        if (term) {
            const pattern = toLikePattern(term);
            select = select.where((eb) =>
                eb.or([
                    sql<boolean>`counterparty LIKE ${pattern} ESCAPE '\\'`,
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
                rows.length > limit && last ? `${last.date}:${last.id}` : null,
        };
        return c.json(page);
    },
);
