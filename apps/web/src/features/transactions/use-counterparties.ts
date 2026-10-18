import { useMemo } from "react";
import { addMonths, endOfDay, startOfMonth } from "date-fns";
import { type Counterparty, summarizeCounterparties } from "@finances/shared";
import { useTransactions } from "#/features/transactions/transaction-queries.ts";

const now = new Date();

/**
 * Enough history for counterparties paid every few months; rarer ones are
 * usually fixed costs.
 */
const HISTORY_MONTHS = 6;

const range = {
    start: startOfMonth(addMonths(now, -HISTORY_MONTHS)),
    end: endOfDay(now),
};

/**
 * The counterparties of recent transactions, most frequent first. Empty
 * while loading.
 */
export function useCounterparties(): Counterparty[] {
    const transactions = useTransactions(range);
    return useMemo(() => summarizeCounterparties(transactions), [transactions]);
}
