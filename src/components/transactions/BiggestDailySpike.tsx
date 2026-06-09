import { useTonalColor } from "@/lib/color-utils.ts";
import { formatEuro } from "@/lib/currency-utils.ts";
import { ChartContainer } from "@/components/ui/chart.tsx";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { transactionRepository } from "@/persistence/repositories/transaction-repository.ts";

export function BiggestDailySpike() {
    const trend = transactionRepository.getTrend();
    const spike = transactionRepository.getSpike();

    const textColor = useTonalColor(spike.category_color, {
        light: 15,
        dark: 90,
    });

    if (!trend || !spike) {
        return null;
    }

    return (
        <div
            className={
                "bg-surface-container-high flex flex-col space-y-2 rounded-xl p-4 shadow-lg"
            }
        >
            <div className={"flex flex-col"}>
                <div className={"font-poppins text-lg font-medium"}>
                    30-Tage Trend
                </div>
                <div className={"text-md text-on-surface-variant"}>
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
                    className={"font-poppins text-lg font-extrabold"}
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
        </div>
    );
}
