import { parseCronExpression } from "cron-schedule";
import { endOfMonth, startOfMonth } from "date-fns";

type CronRepeatRule = {
    /**
     * A cron expression that defines when the expense should be repeated.
     */
    cron: string;

    /**
     * The start date of the repeat rule.
     * This is a timestamp in milliseconds.
     */
    startDate?: number;

    /**
     * The end date of the repeat rule.
     * This is a timestamp in milliseconds.
     */
    endDate?: number;
};

export type FixedCost = {
    id: string;
    expense: string;
    color?: string;
    icon?: string;
    amount: number;
    repeatRule: CronRepeatRule;
};

/**
 * Calculates the total of fixed cost events that occur within the given month.
 * @param fixedCosts List of fixed cost definitions.
 * @param referenceDate Any date within the month to calculate for. Defaults to current date.
 * @returns Sum of cost amounts that occur in the selected month.
 */
export function getCostsWithinMonth(
    fixedCosts: FixedCost[],
    referenceDate: Date = new Date(),
): Pick<FixedCost, "icon" | "color" | "id" | "amount" | "expense">[] {
    const dueCosts: ReturnType<typeof getCostsWithinMonth> = [];

    for (const cost of fixedCosts) {
        const cron = parseCronExpression(cost.repeatRule.cron);
        const iterator = cron.getNextDatesIterator(
            startOfMonth(referenceDate),
            endOfMonth(referenceDate),
        );

        for (
            let result = iterator.next();
            !result.done;
            result = iterator.next()
        ) {
            const occurrence = result.value;
            const time = occurrence.getTime();

            if (
                (!cost.repeatRule.startDate ||
                    time >= cost.repeatRule.startDate) &&
                (!cost.repeatRule.endDate || time <= cost.repeatRule.endDate)
            ) {
                dueCosts.push(cost);
            }
        }
    }

    return dueCosts;
}

export const isIncome = <T extends { amount: number }>(cost: T): boolean =>
    cost.amount < 0;

export const isSaving = <T extends { id: string }>(cost: T): boolean =>
    cost.id === "savings" || cost.id === "savings-btc";
