import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import { formatEuro } from "@/lib/currency-utils.ts";
import type { FC } from "react";
import type { ChartData } from "@/components/reporting/use-expense-data.ts";

type Props = {
    chartData: ChartData;
};

export const ExpenseRadarChart: FC<Props> = ({ chartData }) => {
    return (
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
    );
};
const chartConfig = {
    spent: {
        label: "Spent",
        color: "var(--color-primary)",
    },
} satisfies ChartConfig;
