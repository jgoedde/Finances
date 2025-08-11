import { ArrowDown, ArrowUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { getSpentAmountInMonth } from "@/components/expenses/selectors.ts";
import { addMonths } from "date-fns";
import { useExpenses } from "@/components/expenses/use-expenses.ts";

export function MonthlyOverview() {
    const expenses = useExpenses();
    const lastMonth = addMonths(new Date(), -1);
    const spentThisMonth = getSpentAmountInMonth(expenses, {
        year: new Date().getFullYear(),
        monthIndex: new Date().getMonth(),
    });
    const spentLastMonth = getSpentAmountInMonth(expenses, {
        year: lastMonth.getFullYear(),
        monthIndex: lastMonth.getMonth(),
    });

    const amountDiffNowVsLastMonth = spentThisMonth - spentLastMonth;
    const trendPercentage = (amountDiffNowVsLastMonth / spentLastMonth) * 100;
    const trendPercentageStr = Math.abs(trendPercentage).toFixed(0);

    return (
        <div className={"bg-surface-container-lowest m-2 flex rounded-md p-4"}>
            <div>
                <div className={"flex items-center gap-x-4"}>
                    <div
                        className={
                            "bg-primary-container flex w-24 items-center justify-center self-stretch rounded p-2 shadow-lg"
                        }
                    >
                        <Calendar
                            className={"text-on-primary-container size-6"}
                        />
                    </div>
                    <div
                        className={
                            "text-md flex flex-wrap items-center rounded-sm"
                        }
                    >
                        <div>Du hast diesen Monat insgesamt</div>
                        <div
                            className={cn(
                                "mx-1 flex items-center",
                                amountDiffNowVsLastMonth > 0
                                    ? "text-error"
                                    : "text-[green] dark:text-[lightgreen]",
                            )}
                        >
                            {amountDiffNowVsLastMonth > 0 ? (
                                <ArrowUp className={"size-4"} />
                            ) : (
                                <ArrowDown className={"size-4"} />
                            )}{" "}
                            {trendPercentageStr}%{" "}
                            {amountDiffNowVsLastMonth > 0 ? "mehr" : "weniger"}
                        </div>
                        <div className={""}>Ausgaben als im Mai.</div>
                    </div>
                </div>
                {/*<div className={"mt-8 flex flex-col gap-y-3"}>*/}
                {/*    {categories.map((category) => (*/}
                {/*        <MonthlyCategoryRow*/}
                {/*            category={category}*/}
                {/*            key={category.icon}*/}
                {/*        />*/}
                {/*    ))}*/}
                {/*</div>*/}
            </div>
        </div>
    );
}
