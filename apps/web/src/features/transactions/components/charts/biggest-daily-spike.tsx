import { useTonalColor } from "@/utils/color.ts";
import { formatEuro } from "@/utils/currency.ts";
import { ChartContainer } from "@/components/ui/chart.tsx";
import { Card } from "@/components/ui/card.tsx";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { transactionRepository } from "@/features/transactions/transaction-repository.ts";

export function BiggestDailySpike() {
    const trend = transactionRepository.getTrend();
    const spike = transactionRepository.getSpike();

    // @ts-expect-error -- yeah, oversight. Should do better undefined checking...
    const textColor = useTonalColor(spike.category_color, {
        light: 15,
        dark: 90,
    });

    if (!trend || !spike) {
        return null;
    }

    return (
        <Card className={"gap-2 p-4"}>
            <div className={"flex flex-col"}>
                <h2 className={"font-brand text-title-large"}>30-Tage Trend</h2>
                <div className={"text-body-medium text-on-surface-variant"}>
                    Teuerste Ausgaben für{" "}
                    <span
                        className={"font-semibold"}
                        style={{ color: textColor }}
                    >
                        {spike.category_name}
                    </span>
                    , am{" "}
                    {new Date(spike.day).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
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
                            day: { label: "Tag", color: "text-primary" },
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
                                tickFormatter={(v) => {
                                    return new Date(v).toLocaleDateString(
                                        "de-DE",
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
                                stroke={spike.category_color}
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
