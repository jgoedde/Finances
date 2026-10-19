import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import {
    formatCurrency,
    formatMonthYear,
    formatShortMonth,
    type MonthlyTotal,
    type MonthOverview,
} from "@finances/shared";
import { Card } from "#/components/ui/card.tsx";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "#/components/ui/chart.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

/**
 * `YYYY-MM` as its first day, local time.
 */
function toDate(month: string) {
    return new Date(`${month}-01T00:00:00`);
}

interface TrendCardProps {
    overview: MonthOverview;
}

/**
 * Net spending of the last twelve months; the selected month stands out.
 */
export function TrendCard({ overview }: TrendCardProps) {
    const { trend } = overview;
    const selectedIndex = trend.length - 1;

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
                className={"aspect-2/1 w-full"}
            >
                <BarChart data={trend} margin={{ left: 0, right: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey={"month"}
                        tickLine={false}
                        axisLine={false}
                        interval={"preserveStartEnd"}
                        tickFormatter={(month: string) =>
                            formatShortMonth(toDate(month), getLocale())
                        }
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                hideIndicator
                                labelFormatter={(_, payload) => {
                                    const month = (
                                        payload[0]?.payload as
                                            MonthlyTotal | undefined
                                    )?.month;
                                    return month
                                        ? formatMonthYear(
                                              toDate(month),
                                              getLocale(),
                                          )
                                        : null;
                                }}
                                formatter={(value) =>
                                    formatCurrency(Number(value), getLocale())
                                }
                            />
                        }
                    />
                    <Bar
                        dataKey={"total"}
                        radius={4}
                        shape={(props) => (
                            <Rectangle
                                {...props}
                                className={
                                    props.index === selectedIndex
                                        ? "fill-primary"
                                        : "fill-primary/40"
                                }
                            />
                        )}
                    />
                </BarChart>
            </ChartContainer>
        </Card>
    );
}
