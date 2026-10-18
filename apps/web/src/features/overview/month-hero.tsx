import { TrendingDown, TrendingUp } from "lucide-react";
import type { MonthOverview } from "@finances/shared";
import { Card } from "#/components/ui/card.tsx";
import { formatPercent } from "#/features/overview/format-percent.ts";
import { formatEuro } from "#/utils/currency.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

/** Below this share, a month counts as typical. */
const EVEN_THRESHOLD = 0.02;

function paceText({ day, netSpending, typical }: MonthOverview["pace"]) {
    if (typical === null || typical <= 0) {
        return m.overview_pace_none();
    }
    const change = (netSpending - typical) / typical;
    if (Math.abs(change) < EVEN_THRESHOLD) {
        return m.overview_pace_even();
    }
    const percent = formatPercent(Math.abs(change));
    if (day === null) {
        return change > 0
            ? m.overview_pace_above_month({ percent })
            : m.overview_pace_below_month({ percent });
    }
    return change > 0
        ? m.overview_pace_above_day({ percent, day })
        : m.overview_pace_below_day({ percent, day });
}

interface MonthHeroProps {
    overview: MonthOverview;
}

/** Net spending of the month with its pace, the hero of the Overview. */
export function MonthHero({ overview }: MonthHeroProps) {
    const { pace, exceptional } = overview;
    const isAbove =
        pace.typical !== null &&
        pace.typical > 0 &&
        (pace.netSpending - pace.typical) / pace.typical >= EVEN_THRESHOLD;
    const PaceIcon = isAbove ? TrendingUp : TrendingDown;

    return (
        <Card className={"gap-4 p-5"}>
            <div className={"flex flex-col gap-1"}>
                <span className={"text-label-large text-on-surface-variant"}>
                    {m.overview_net_spending()}
                </span>
                <span
                    className={"font-brand text-display-medium text-on-surface"}
                >
                    {formatEuro(overview.netSpending)}
                </span>
                <span
                    className={cn(
                        "flex items-center gap-2 text-body-medium",
                        isAbove ? "text-error" : "text-on-surface-variant",
                    )}
                >
                    {pace.typical !== null && (
                        <PaceIcon className={"size-5 shrink-0"} />
                    )}
                    {paceText(pace)}
                </span>
                {exceptional.count > 0 && (
                    <span className={"text-body-small text-on-surface-variant"}>
                        {m.overview_exceptional({
                            count: exceptional.count,
                            amount: formatEuro(exceptional.netSpending),
                        })}
                    </span>
                )}
            </div>
            <dl
                className={`grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-t
                    border-outline-variant pt-3 text-body-medium`}
            >
                <dt className={"text-on-surface-variant"}>
                    {m.overview_fixed_costs()}
                </dt>
                <dd className={"text-right text-on-surface"}>
                    {formatEuro(overview.fixedCosts)}
                </dd>
                <dt className={"text-on-surface-variant"}>
                    {m.overview_total_outflow()}
                </dt>
                <dd className={"text-right text-title-medium text-on-surface"}>
                    {formatEuro(overview.netSpending + overview.fixedCosts)}
                </dd>
            </dl>
        </Card>
    );
}
