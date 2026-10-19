import { z } from "zod";
import { type Transaction, transactionIdSchema } from "@finances/shared";
import type { TransactionsTable } from "#/db/schema.ts";

export const transactionIdParam = z.object({ id: transactionIdSchema });

export function toTransaction(row: TransactionsTable): Transaction {
    return {
        id: row.id,
        date: row.date,
        counterparty: row.counterparty,
        description: row.description,
        kind: row.kind,
        amount: Number(row.amount),
        currency: row.currency,
        categoryId: row.category_id,
        exceptional: row.exceptional === 1,
        location:
            row.location_lat !== null &&
            row.location_lng !== null &&
            row.location_accuracy !== null
                ? {
                      lat: row.location_lat,
                      lng: row.location_lng,
                      accuracy: row.location_accuracy,
                  }
                : null,
    };
}

/**
 * The location as stored in the `location_*` columns.
 */
export function toLocationColumns(location: Transaction["location"]) {
    return {
        location_lat: location?.lat ?? null,
        location_lng: location?.lng ?? null,
        location_accuracy: location?.accuracy ?? null,
    };
}

/**
 * Wraps a search term in `%` and escapes `%`, `_` and the backslash.
 */
export function toLikePattern(term: string): string {
    return `%${term.replace(/[\\%_]/g, "\\$&")}%`;
}
