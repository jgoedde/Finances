import { Area, AreaChart, Tooltip, YAxis } from "recharts";
import type { MonthlyFixedCostTotal } from "@finances/shared";
import { ChartContainer } from "#/components/ui/chart.tsx";
import { FixedCostHistoryTooltip } from "#/features/fixed-costs/history/fixed-cost-history-tooltip.tsx";
import { m } from "#/paraglide/messages.js";

interface FixedCostHistoryChartProps {
    totals: MonthlyFixedCostTotal[];
}

/**
 * The monthly fixed-cost total over time as a stepped area without axes,
 * from 0. One point per month, so the tooltip follows the cursor.
 */
export function FixedCostHistoryChart({ totals }: FixedCostHistoryChartProps) {
    return (
        <ChartContainer
            config={{}}
            role={"img"}
            aria-label={m.fixed_cost_history_label()}
            className={"aspect-auto h-28 w-full"}
        >
            <AreaChart
                data={totals}
                margin={{ left: 0, right: 0, top: 4, bottom: 0 }}
            >
                <YAxis domain={[0, "dataMax"]} hide />
                <Tooltip
                    cursor={{ strokeWidth: 1 }}
                    isAnimationActive={false}
                    // Above the range chips below, whose state layers are
                    // positioned and would paint over it.
                    wrapperStyle={{ zIndex: 10 }}
                    content={({ active, payload }) => {
                        const total = payload[0]?.payload as
                            MonthlyFixedCostTotal | undefined;
                        return active && total ? (
                            <FixedCostHistoryTooltip total={total} />
                        ) : null;
                    }}
                />
                <Area
                    dataKey={"total"}
                    type={"stepAfter"}
                    stroke={"var(--color-primary)"}
                    strokeWidth={2}
                    fill={"var(--color-primary)"}
                    fillOpacity={0.12}
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                />
            </AreaChart>
        </ChartContainer>
    );
}
