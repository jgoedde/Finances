import _ from "lodash";
import { nameKey } from "./spending.ts";
import type { Transaction, TransactionKind } from "./transactions.ts";

/**
 * What the history says about one counterparty: where money went or where
 * it came from, i.e. a transaction name regardless of case.
 */
export interface Counterparty {
    /**
     * The most recent spelling.
     */
    name: string;
    count: number;

    /**
     * The most frequent category of its transactions; ties go to the most
     * recent.
     */
    categoryId: string;

    /**
     * The most frequent kind of its transactions; ties go to the most recent.
     */
    kind: TransactionKind;
    lastAmount: number;

    /**
     * Unix timestamps in milliseconds, newest first.
     */
    dates: number[];
}

type CounterpartySource = Pick<
    Transaction,
    "name" | "date" | "categoryId" | "kind" | "amount"
>;

/**
 * The most frequent value; ties go to the first one, so pass newest first.
 */
function mostFrequent<T>(values: T[]): T {
    const counts = _.countBy(values, String);
    return _.maxBy(values, (value) => counts[String(value)])!;
}

/**
 * Groups transactions by name into counterparties, most frequent first.
 */
export function summarizeCounterparties(
    transactions: CounterpartySource[],
): Counterparty[] {
    const groups = _.groupBy(_.orderBy(transactions, "date", "desc"), nameKey);
    const counterparties = Object.values(groups).map((group) => ({
        name: group[0]!.name.trim(),
        count: group.length,
        categoryId: mostFrequent(group.map((it) => it.categoryId)),
        kind: mostFrequent(group.map((it) => it.kind)),
        lastAmount: group[0]!.amount,
        dates: group.map((it) => it.date),
    }));
    return _.orderBy(counterparties, ["count", "name"], ["desc", "asc"]);
}

/**
 * The counterparty with exactly this name, regardless of case.
 */
export function findCounterparty(
    counterparties: Counterparty[],
    name: string,
): Counterparty | undefined {
    const key = nameKey({ name });
    return counterparties.find((it) => nameKey(it) === key);
}

/**
 * Morning, midday, evening or night.
 */
function timeOfDay(date: Date): number {
    const hour = date.getHours();
    if (hour >= 5 && hour < 11) return 0;
    if (hour >= 11 && hour < 17) return 1;
    if (hour >= 17 && hour < 22) return 2;
    return 3;
}

/**
 * The counterparties most likely right now: frequent ones, especially those
 * usually paid at this time of day or on this weekday. Ties keep the order of
 * `counterparties`, so the result doesn't jump between renders.
 */
export function rankCounterparties(
    counterparties: Counterparty[],
    now: Date,
    limit: number,
): Counterparty[] {
    const scored = counterparties.map((counterparty) => {
        const dates = counterparty.dates.map((it) => new Date(it));
        const sameTime = dates.filter(
            (it) => timeOfDay(it) === timeOfDay(now),
        ).length;
        const sameWeekday = dates.filter(
            (it) => it.getDay() === now.getDay(),
        ).length;
        return {
            counterparty,
            score: counterparty.count + sameTime * 2 + sameWeekday * 2,
        };
    });
    return _.orderBy(scored, "score", "desc")
        .slice(0, limit)
        .map((it) => it.counterparty);
}

/**
 * Words of a name, ignoring case, punctuation and plain numbers (store
 * numbers, dates).
 */
function words(name: string): string[] {
    return name
        .toLocaleLowerCase("de")
        .split(/[^\p{L}\p{N}]+/u)
        .filter((word) => word !== "" && !/^\d+$/.test(word));
}

/**
 * The known counterparty a raw name (e.g. "ALDI NORD 1234 HAMBURG" from a
 * card statement) most likely stands for: the one with the most words, all
 * of which appear in the raw name. None if the raw name already is a known
 * counterparty, spelled the same way.
 */
export function matchCounterparty(
    counterparties: Counterparty[],
    raw: string,
): Counterparty | undefined {
    if (counterparties.some((it) => it.name === raw.trim())) {
        return undefined;
    }
    const rawWords = new Set(words(raw));
    const candidates = counterparties
        .map((counterparty) => ({
            counterparty,
            words: words(counterparty.name),
        }))
        .filter(
            (it) =>
                it.words.length > 0 &&
                it.words.every((word) => rawWords.has(word)),
        );
    return _.orderBy(
        candidates,
        [(it) => it.words.length, (it) => it.counterparty.count],
        ["desc", "desc"],
    )[0]?.counterparty;
}
