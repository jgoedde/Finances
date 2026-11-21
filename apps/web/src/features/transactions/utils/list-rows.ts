import { netSpending, type Transaction } from "@finances/shared";

/**
 * One row of the transaction list with what renders below or inside it.
 */
export interface ListRow {
    transaction: Transaction;

    /**
     * The expenses attached to this one that are in view, shown right below
     * it; empty for anything but a main expense.
     */
    attached: Transaction[];

    /**
     * The main expense of an attached expense whose main expense isn't in
     * view (category filter, search), for the "belongs to" hint; `undefined`
     * otherwise, or while it's unknown.
     */
    mainExpense: Transaction | undefined;
}

/**
 * Arranges one stretch of the list (a day, the upcoming transactions):
 * attached expenses move right below their main expense when it is part of
 * `transactions`, otherwise they stay regular rows and get their main expense
 * from `findMainExpense` for the hint.
 */
export function toListRows(
    transactions: Transaction[],
    findMainExpense: (id: string) => Transaction | undefined = () => undefined,
): ListRow[] {
    const shown = new Set(transactions.map((it) => it.id));
    const attachedTo = new Map<string, Transaction[]>();
    for (const it of transactions) {
        if (it.mainExpenseId !== null && shown.has(it.mainExpenseId)) {
            attachedTo.set(it.mainExpenseId, [
                ...(attachedTo.get(it.mainExpenseId) ?? []),
                it,
            ]);
        }
    }

    return transactions
        .filter(
            (it) => it.mainExpenseId === null || !shown.has(it.mainExpenseId),
        )
        .map((it) => ({
            transaction: it,
            attached: attachedTo.get(it.id) ?? [],
            mainExpense:
                it.mainExpenseId === null
                    ? undefined
                    : findMainExpense(it.mainExpenseId),
        }));
}

/**
 * What the occasion of a main expense cost: its own net spending plus its
 * attached expenses, in whole cents. `cached` adds attached expenses the view
 * filters out; the row's own versions win.
 */
export function occasionTotal(row: ListRow, cached: Transaction[]): number {
    const attached = new Map(cached.map((it) => [it.id, it]));
    for (const it of row.attached) {
        attached.set(it.id, it);
    }
    const cents = [...attached.values()].reduce(
        (sum, it) => sum + Math.round(netSpending(it) * 100),
        Math.round(netSpending(row.transaction) * 100),
    );
    return cents / 100;
}
