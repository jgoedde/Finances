import { Area, AreaChart, Tooltip, XAxis, YAxis } from "recharts";
import {
    type AmountDay,
    type FixedCost as FixedCostRecord,
    formatCurrency,
    formatLongDate,
    formatMonthYear,
    getAmountTimeline,
} from "@finances/shared";
import { ChartContainer } from "#/components/ui/chart.tsx";
import { fromIsoDate } from "#/features/fixed-costs/fixed-cost.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

/**
 * A day of the timeline with its x value; `past` and `future` split the
 * amount into the solid and the dashed area, both set on today so they
 * meet.
 */
interface Point extends AmountDay {
    t: number;
    past: number | null;
    future: number | null;
}

interface AmountSparklineProps {
    record: FixedCostRecord;

    /**
     * `YYYY-MM-DD`.
     */
    today: string;
}

/**
 * The amount per interval over time, stepped: solid up to today, dashed
 * after it. One point per day, so the tooltip follows the cursor.
 */
export function AmountSparkline({ record, today }: AmountSparklineProps) {
    const points = getAmountTimeline(record, today).map((day): Point => ({
        ...day,
        t: fromIsoDate(day.date).getTime(),
        past: day.date <= today ? day.amount : null,
        future: day.date >= today ? day.amount : null,
    }));

    return (
        <ChartContainer config={{}} className={"aspect-auto h-20 w-full"}>
            <AreaChart
                data={points}
                margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
            >
                <XAxis
                    dataKey={"t"}
                    type={"number"}
                    scale={"time"}
                    domain={["dataMin", "dataMax"]}
                    hide
                />
                <YAxis domain={[0, "dataMax"]} hide />
                <Tooltip
                    cursor={{ strokeWidth: 1 }}
                    isAnimationActive={false}
                    content={({ active, payload }) => {
                        const point = payload[0]?.payload as Point | undefined;
                        if (!active || !point) {
                            return null;
                        }
                        // The day only within a month whose amount changes
                        // after the 1st.
                        const label = (date: string) =>
                            point.dayPrecision &&
                            date.slice(0, 7) === point.date.slice(0, 7)
                                ? formatLongDate(fromIsoDate(date), getLocale())
                                : formatMonthYear(
                                      fromIsoDate(date),
                                      getLocale(),
                                  );
                        return (
                            <div
                                className={`flex flex-col gap-0.5 rounded-sm
                                bg-surface-container-highest p-3 text-body-small
                                text-on-surface shadow-elevation-2`}
                            >
                                <span
                                    className={`text-label-medium
                                    text-on-surface-variant`}
                                >
                                    {label(point.date)}
                                    {point.upcoming &&
                                        ` · ${m.amount_sparkline_upcoming()}`}
                                </span>
                                <span className={"font-brand text-label-large"}>
                                    {formatCurrency(
                                        point.amount,
                                        getLocale(),
                                        record.currency,
                                    )}
                                </span>
                                <span className={"text-on-surface-variant"}>
                                    {point.since === record.startDate
                                        ? m.amount_sparkline_since_start()
                                        : m.amount_sparkline_since({
                                              date: label(point.since),
                                          })}
                                </span>
                            </div>
                        );
                    }}
                />
                <Area
                    dataKey={"past"}
                    type={"stepAfter"}
                    stroke={"var(--color-primary)"}
                    strokeWidth={2}
                    fill={"var(--color-primary)"}
                    fillOpacity={0.12}
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                />
                <Area
                    dataKey={"future"}
                    type={"stepAfter"}
                    stroke={"var(--color-primary)"}
                    strokeWidth={2}
                    strokeDasharray={"4 4"}
                    fill={"var(--color-primary)"}
                    fillOpacity={0.05}
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                />
            </AreaChart>
        </ChartContainer>
    );
}
