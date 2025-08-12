import { formatEuro } from "@/lib/currency-utils.ts";
import {
    endOfDay,
    endOfWeek,
    startOfMonth,
    startOfWeek,
    startOfYear,
} from "date-fns";
import type { Expense } from "@/persistence/types.ts";
import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { expensesRepository } from "@/persistence/repository.ts";
import { useEncryption } from "@/components/use-encryption.ts";

const now = new Date();

export function Insights() {
    const { key } = useEncryption();

    const topExpenseThisWeek = useTableSubscription(
        () =>
            key == null
                ? []
                : expensesRepository.getTop(
                      {
                          start: startOfWeek(now, {
                              weekStartsOn: 1,
                          }),
                          end: endOfWeek(now, {
                              weekStartsOn: 1,
                          }),
                          limit: 1,
                      },
                      key,
                  ),
        [key],
        "expenses:changed",
    )[0] as Expense | undefined;

    const topExpenseThisYear = useTableSubscription(
        () =>
            key == null
                ? []
                : expensesRepository.getTop(
                      {
                          start: startOfYear(now),
                          end: endOfDay(now),
                          limit: 1,
                      },
                      key,
                  ),
        [key],
        "expenses:changed",
    )[0] as Expense | undefined;

    const mostSpentWeekdayFormatted = useTableSubscription(
        () =>
            expensesRepository.getWeekDayMostSpentOn({
                start: startOfMonth(now),
                end: endOfDay(now),
            }),
        [],
        "expenses:changed",
    );

    const mostExpensiveDayThisYear =
        topExpenseThisYear == undefined
            ? undefined
            : {
                  day: new Date(topExpenseThisYear.date).toLocaleDateString(
                      "de-DE",
                      {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                      },
                  ),
                  expense: topExpenseThisYear.name,
                  amount: topExpenseThisYear.amount,
              };

    return (
        <div className={"mt-8 mb-8 flex w-full flex-wrap gap-y-2 px-4"}>
            {topExpenseThisWeek != null && topExpenseThisWeek.amount > 0 && (
                <div
                    className={
                        "bg-surface-container-low flex w-1/2 flex-col gap-y-1 rounded-sm p-2 text-center"
                    }
                >
                    <div>Teuerstes diese Woche</div>
                    <div className={"font-poppins font-semibold"}>
                        {topExpenseThisWeek.name},{" "}
                        {formatEuro(topExpenseThisWeek.amount)}
                    </div>
                </div>
            )}
            {mostSpentWeekdayFormatted != null && (
                <div
                    className={
                        "bg-surface-container-low flex w-1/2 flex-col gap-y-1 rounded-sm p-2 text-center"
                    }
                >
                    <div>
                        Meiste Ausgaben im{" "}
                        {new Date().toLocaleDateString("de-DE", {
                            month: "long",
                        })}
                    </div>
                    <div className={"font-poppins font-semibold"}>
                        {mostSpentWeekdayFormatted.day}s
                    </div>
                </div>
            )}
            {mostExpensiveDayThisYear != null && (
                <div
                    className={
                        "bg-surface-container-low flex w-1/2 flex-col gap-y-1 rounded-sm p-2 text-center"
                    }
                >
                    <div>Teuerster Tag {new Date().getFullYear()}</div>
                    <div className={"font-poppins font-semibold"}>
                        {mostExpensiveDayThisYear.day},{" "}
                        {mostExpensiveDayThisYear.expense},{" "}
                        {formatEuro(mostExpensiveDayThisYear.amount)}
                    </div>
                </div>
            )}
        </div>
    );
}
