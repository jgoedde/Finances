import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { useAppSelector } from "@/hooks.ts";
import { expensesSelectors } from "@/components/expenses/slice.ts";
import { useMemo, useState } from "react";
import { formatEuro } from "@/lib/currency-utils.ts";
import { format, isSameMonth } from "date-fns";
import { Button } from "@/components/ui/button.tsx";

const chartConfig = {
    spent: {
        label: "Spent",
        color: "var(--color-primary)",
    },
} satisfies ChartConfig;

export const Reporting = () => {
    const [, router] = useLocation();
    const [month, setMonth] = useState<{ year: number; monthIndex: number }>({
        year: new Date().getFullYear(),
        monthIndex: new Date().getMonth(),
    });

    const expenses = useAppSelector(expensesSelectors.selectAll);

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

    const categories = useMemo(() => {
        const categories = new Set<string>();

        expenses
            .filter((expense) =>
                isSameMonth(
                    new Date(month.year, month.monthIndex, 1),
                    new Date(expense.date),
                ),
            )
            .forEach((expense) => {
                if (expense.category) {
                    categories.add(expense.category.name);
                }
            });
        return Array.from(categories);
    }, [expenses, month.monthIndex, month.year]);

    const chartData = useMemo(
        () =>
            categories.map((category) => {
                const total = expenses
                    .filter((expense) => expense.category?.name === category)
                    .filter((expense) =>
                        isSameMonth(
                            new Date(month.year, month.monthIndex, 1),
                            new Date(expense.date),
                        ),
                    )
                    .reduce((acc, expense) => acc + expense.amount, 0);

                return {
                    category: category,
                    spent: total,
                };
            }),
        [categories, expenses, month.monthIndex, month.year],
    );

    const totalSpent = useMemo(() => {
        return chartData.reduce((acc, chart) => {
            return acc + chart.spent;
        }, 0);
    }, [chartData]);

    const expensesCount = useMemo(() => {
        return expenses.filter((expense) =>
            isSameMonth(
                new Date(month.year, month.monthIndex, 1),
                new Date(expense.date),
            ),
        ).length;
    }, [expenses, month.monthIndex, month.year]);

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
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] w-full"
                >
                    <RadarChart data={chartData}>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <PolarAngleAxis
                            dataKey="category"
                            tick={({ x, y, textAnchor, index, ...props }) => {
                                const data = chartData[index];
                                return (
                                    <text
                                        x={x}
                                        y={index === 0 ? y - 10 : y}
                                        textAnchor={textAnchor}
                                        fontSize={13}
                                        fontWeight={500}
                                        {...props}
                                    >
                                        <tspan className={"fill-primary"}>
                                            {formatEuro(data.spent)}
                                        </tspan>
                                        <tspan
                                            x={x}
                                            dy={"1rem"}
                                            fontSize={12}
                                            className={"fill-outline"}
                                        >
                                            {data.category}
                                        </tspan>
                                    </text>
                                );
                            }}
                        />
                        <PolarGrid />
                        <Radar
                            dataKey="spent"
                            fill="var(--color-primary)"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ChartContainer>
                <div className={"mt-5 flex flex-col gap-y-5"}>
                    <div
                        className={
                            "bg-custom-1-container text-on-custom-1-container font-poppins motion-preset-slide-left motion-delay-200 motion-duration-300 flex w-4/5 min-w-4/5 flex-col rounded px-5 py-8"
                        }
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
                            "bg-custom-2-container text-on-custom-2-container font-poppins motion-preset-slide-right motion-delay-500 motion-duration-300 flex w-3/5 min-w-3/5 flex-col self-end rounded px-5 py-4"
                        }
                    >
                        <div className={"self-end text-[58px]/12 font-bold"}>
                            {expensesCount}
                        </div>
                        <div className={"self-end"}>transactions</div>
                    </div>
                    <div
                        className={
                            "bg-custom-3-container text-on-custom-3-container font-poppins motion-preset-slide-left motion-delay-800 motion-duration-300 flex w-4/5 min-w-4/5 flex-col rounded px-5 py-8"
                        }
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
