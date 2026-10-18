import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";
import type { MonthlyTotal, MonthOverview } from "@finances/shared";
import { Card } from "#/components/ui/card.tsx";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "#/components/ui/chart.tsx";
import { formatEuro } from "#/utils/currency.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

function monthLabel(month: string, style: "short" | "long") {
    return new Date(`${month}-01T12:00:00`).toLocaleDateString(getLocale(), {
        month: style,
        year: style === "long" ? "numeric" : undefined,
    });
}

interface TrendCardProps {
    overview: MonthOverview;
}

/** Net spending of the last twelve months; the selected month stands out. */
export function TrendCard({ overview }: TrendCardProps) {
    const { trend } = overview;
    const selected = trend[trend.length - 1]?.month;

    return (
        <Card className={"gap-3 p-4"}>
            <div className={"flex flex-col px-1"}>
                <h2 className={"font-brand text-title-large text-on-surface"}>
                    {m.overview_trend_title()}
                </h2>
                <span className={"text-body-small text-on-surface-variant"}>
                    {m.overview_trend_hint()}
                </span>
            </div>
            <ChartContainer
                config={{ total: { label: m.overview_net_spending() } }}
                className={"aspect-[2/1] w-full"}
            >
                <BarChart data={trend} margin={{ left: 0, right: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey={"month"}
                        tickLine={false}
                        axisLine={false}
                        interval={"preserveStartEnd"}
                        tickFormatter={(month: string) =>
                            monthLabel(month, "short")
                        }
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                hideIndicator
                                labelFormatter={(_, payload) =>
                                    monthLabel(
                                        (
                                            payload[0]?.payload as
                                                MonthlyTotal | undefined
                                        )?.month ?? "",
                                        "long",
                                    )
                                }
                                formatter={(value) => formatEuro(Number(value))}
                            />
                        }
                    />
                    <Bar dataKey={"total"} radius={4}>
                        {trend.map(({ month }) => (
                            <Cell
                                key={month}
                                className={
                                    month === selected
                                        ? "fill-primary"
                                        : "fill-primary/40"
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ChartContainer>
        </Card>
    );
}
