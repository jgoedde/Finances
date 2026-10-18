import { useTonalColor } from "#/utils/color.ts";
import { formatEuro } from "#/utils/currency.ts";
import { ChartContainer } from "#/components/ui/chart.tsx";
import { Card } from "#/components/ui/card.tsx";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useSpike, useTrend } from "#/features/transactions/insight-queries.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

export function BiggestDailySpike() {
    const trend = useTrend();
    const spike = useSpike();

    const textColor = useTonalColor(spike?.categoryColor ?? "#000000", {
        light: 15,
        dark: 90,
    });

    if (!spike) {
        return null;
    }

    return (
        <Card className={"gap-2 p-4"}>
            <div className={"flex flex-col"}>
                <h2 className={"font-brand text-title-large"}>
                    {m.insights_trend_title()}
                </h2>
                <div className={"text-body-medium text-on-surface-variant"}>
                    {m.insights_trend_spike_category()}{" "}
                    <span
                        className={"font-semibold"}
                        style={{ color: textColor }}
                    >
                        {spike.categoryName}
                    </span>
                    {m.insights_trend_spike_date({
                        date: new Date(spike.day).toLocaleDateString(
                            getLocale(),
                            { day: "2-digit", month: "2-digit" },
                        ),
                    })}
                </div>
            </div>
            <div className={"flex space-x-2"}>
                <div
                    className={"font-brand text-title-large font-semibold"}
                    style={{
                        color: textColor,
                    }}
                >
                    {formatEuro(spike.total)}
                </div>
                <div className={"w-full grow"}>
                    <ChartContainer
                        config={{
                            day: {
                                label: m.insights_trend_day(),
                                color: "text-primary",
                            },
                        }}
                    >
                        <LineChart accessibilityLayer data={trend}>
                            <CartesianGrid
                                horizontal={true}
                                vertical={false}
                                stroke={"var(--color-surface-variant)"}
                            />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v: string) => {
                                    return new Date(v).toLocaleDateString(
                                        getLocale(),
                                        {
                                            day: "numeric",
                                            month: "numeric",
                                        },
                                    );
                                }}
                            />
                            <Line
                                dataKey="total"
                                type="linear"
                                stroke={spike.categoryColor}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                </div>
            </div>
        </Card>
    );
}
