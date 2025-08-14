import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { expensesRepository } from "@/persistence/repository.ts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { useTonalColor } from "@/lib/color-utils.ts";

export function WeekdayVsWeekend() {
    const stats = useTableSubscription(
        expensesRepository.getWeekendVsWeekdayTotals,
        [],
        "expenses:changed",
    );

    const root = document.documentElement;
    const style = getComputedStyle(root);

    const maxValueColor = style.getPropertyValue("--color-primary");
    const minValueColor = useTonalColor(
        style.getPropertyValue("--color-primary"),
        {
            light: 70,
            dark: 50,
        },
    );

    const chartData = useMemo(
        () =>
            stats.map((s) => ({
                day_type: s.day_type === "Weekday" ? "Werktag" : "Wochenende",
                total_spent: s.total_spent,
                fill:
                    s.total_spent ===
                    stats.reduce(
                        (a, b) => Math.max(a, b.total_spent),
                        -Infinity,
                    )
                        ? maxValueColor
                        : minValueColor,
            })),
        [maxValueColor, minValueColor, stats],
    );

    return (
        <div
            className={
                "bg-surface-container-high flex flex-col space-y-2 rounded-xl p-4 shadow-lg"
            }
        >
            <div className={"flex flex-col"}>
                <div className={"font-poppins text-lg font-medium"}>
                    Wochenende vs. Werktag
                </div>
                <div className={"text-md text-on-surface-variant"}>
                    Letzte 90 Tage
                </div>
            </div>
            <div className={"flex space-x-2"}>
                <div className={"w-full grow"}>
                    <ChartContainer
                        config={{
                            Weekday: {
                                label: "Werktag",
                                color: "red",
                            },
                            Weekend: {
                                label: "Wochenende",
                                color: "red",
                            },
                            total_spent: {
                                label: "Ausgegeben",
                            },
                        }}
                        className={"max-h-[120px] w-full"}
                    >
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            margin={{
                                left: 30,
                            }}
                        >
                            <XAxis type="number" dataKey="total_spent" />
                            <YAxis
                                dataKey="day_type"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="total_spent" radius={5} />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
}
