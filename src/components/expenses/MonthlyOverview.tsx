import { ArrowDown, ArrowUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { categories } from "@/components/expenses/editor/categories.ts";
import { MonthlyCategoryRow } from "@/components/expenses/monthly-category-row.tsx";
import { DynamicIcon } from "lucide-react/dynamic";
import { useAppSelector } from "@/redux-hooks.ts";
import { selectSpentInMonth } from "@/components/expenses/selectors.ts";
import { addMonths } from "date-fns";

export function MonthlyOverview() {
    const spentThisMonth = useAppSelector((state) =>
        selectSpentInMonth(state, new Date()),
    );
    const spentLastMonth = useAppSelector((state) =>
        selectSpentInMonth(state, addMonths(new Date(), -1)),
    );

    const amountDiffNowVsLastMonth = spentThisMonth - spentLastMonth;
    const trendPercentage = (amountDiffNowVsLastMonth / spentLastMonth) * 100;
    const trendPercentageStr = trendPercentage.toFixed(0);

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
                <div className={"mt-8 flex flex-col gap-y-3"}>
                    {categories.map((category) => (
                        <MonthlyCategoryRow
                            category={category}
                            key={category.icon}
                        />
                    ))}
                </div>
                <div
                    className={
                        "text-outline mt-6 flex items-center gap-x-4 rounded-sm text-sm"
                    }
                >
                    <div className={"flex grow flex-wrap"}>
                        <div>Du hast diesen Monat</div>
                        <div className={"text-error mx-1 flex items-center"}>
                            <ArrowUp className={"size-4"} /> 12% mehr
                        </div>
                        <div className={""}>
                            für Einkäufe ausgegeben als im Mai.
                        </div>
                    </div>
                    <div>
                        <DynamicIcon name={categories[0].icon} />
                    </div>
                </div>
            </div>
        </div>
    );
}
