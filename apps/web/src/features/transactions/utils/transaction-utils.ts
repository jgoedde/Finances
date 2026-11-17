import type { Transaction, TransactionKind } from "@finances/shared";
import { startOfDay } from "date-fns";
import _ from "lodash";
import { m } from "#/paraglide/messages.js";

const kindToLabelMap = {
    expense: m.kind_expense,
    income: m.kind_income,
} as const satisfies Record<TransactionKind, () => string>;

export function getTransactionKindLabel(kind: TransactionKind): string {
    return kindToLabelMap[kind]();
}

/**
 * A category's name to show; a fallback category has none and is shown as
 * "Sonstiges" / "Other".
 */
export function getCategoryName(name: string | null): string {
    return name ?? m.category_fallback();
}

/**
 * `transactions` grouped by calendar day, the latest day first.
 */
export function groupByDay(
    transactions: Transaction[],
): [day: Date, transactions: Transaction[]][] {
    return Object.entries(
        _.groupBy(transactions, (it) => startOfDay(it.date).getTime()),
    )
        .map(([day, group]): [Date, Transaction[]] => [
            new Date(Number(day)),
            group,
        ])
        .sort(([a], [b]) => b.getTime() - a.getTime());
}
