import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useMemo, useState } from "react";
import { formatEuro } from "@/lib/currency-utils.ts";
import { format } from "date-fns";
import { Button } from "@/components/ui/button.tsx";
import { useRipple } from "@/hooks/use-ripple.ts";
import { ExpenseRadarChart } from "@/components/reporting/expense-radar-chart.tsx";
import { useExpenseData } from "@/components/reporting/use-expense-data.ts";

export const ReportingPage = () => {
    const [, router] = useLocation();
    const [month, setMonth] = useState<{ year: number; monthIndex: number }>({
        year: new Date().getFullYear(),
        monthIndex: new Date().getMonth(),
    });

    const ripple = useRipple();

    const past12Months = useMemo(
        () =>
            Array.from({ length: 12 }, (_, i) => {
                const now = new Date();
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                return {
                    year: date.getFullYear(),
                    monthIndex: date.getMonth(),
                    label: format(date, "MMMM yyyy"),
                };
            }),
        [],
    );

    const { chartData, expensesCount, totalSpent } = useExpenseData({ month });

    return (
        <>
            <div
                className={
                    "bg-surface-container flex h-16 w-dvw items-center py-2"
                }
            >
                <button
                    onClick={() => {
                        router("/");
                    }}
                    className={"text-on-surface cursor-pointer px-4"}
                >
                    <ArrowLeft className={"size-6"} />
                </button>
                <div className={"text-lg"}>Reporting</div>
            </div>
            <div className={"container mx-auto max-w-md px-2"}>
                <div className={"mt-3 mb-8 flex overflow-x-scroll"}>
                    {past12Months.map((it) => (
                        <Button
                            variant={
                                `${month.year}-${month.monthIndex}` ===
                                `${it.year}-${it.monthIndex}`
                                    ? "link"
                                    : "ghost"
                            }
                            key={`${it.year}-${it.monthIndex}`}
                            onClick={() => {
                                setMonth({
                                    year: it.year,
                                    monthIndex: it.monthIndex,
                                });
                            }}
                        >
                            {it.label}
                        </Button>
                    ))}
                </div>
                <ExpenseRadarChart chartData={chartData} />
                <div className={"mt-5 flex flex-col gap-y-5"}>
                    <div
                        className={
                            "ripple-container bg-custom-1-container text-on-custom-1-container font-poppins motion-preset-slide-left motion-delay-200 motion-duration-300 flex w-4/5 min-w-4/5 flex-col rounded px-5 py-8"
                        }
                        data-ripple-color="bg-on-surface/10"
                        {...ripple}
                    >
                        <div className={"text-[58px]/12 font-bold"}>
                            {formatEuro(totalSpent)}
                        </div>
                        <div>
                            spent in{" "}
                            {format(
                                new Date(month.year, month.monthIndex, 1),
                                "MMMM",
                            )}
                        </div>
                    </div>
                    <div
                        className={
                            "ripple-container bg-custom-2-container text-on-custom-2-container font-poppins motion-preset-slide-right motion-delay-500 motion-duration-300 flex w-3/5 min-w-3/5 flex-col self-end rounded px-5 py-4"
                        }
                        data-ripple-color="bg-on-surface/10"
                        {...ripple}
                    >
                        <div className={"self-end text-[58px]/12 font-bold"}>
                            {expensesCount}
                        </div>
                        <div className={"self-end"}>transactions</div>
                    </div>
                    <div
                        className={
                            "ripple-container bg-custom-3-container text-on-custom-3-container font-poppins motion-preset-slide-left motion-delay-800 motion-duration-300 flex w-4/5 min-w-4/5 flex-col rounded px-5 py-8"
                        }
                        data-ripple-color="bg-on-surface/10"
                        {...ripple}
                    >
                        <div className={"text-[58px]/12 font-bold"}>
                            {formatEuro(12.4)}
                        </div>
                        <div>TODO: less than previous month</div>
                    </div>
                </div>
            </div>
        </>
    );
};
