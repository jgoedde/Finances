import { useState } from "react";
import { formatCurrency, formatMonthYear } from "@finances/shared";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import { Card } from "#/components/ui/card.tsx";
import { useFixedCostHistory } from "#/features/fixed-costs/fixed-cost-queries.ts";
import { fromIsoDate } from "#/features/fixed-costs/fixed-cost.ts";
import { FixedCostChangeLog } from "#/features/fixed-costs/history/fixed-cost-change-log.tsx";
import { FixedCostHistoryChart } from "#/features/fixed-costs/history/fixed-cost-history-chart.tsx";
import {
    HISTORY_RANGES,
    type HistoryRange,
    HistoryRangeChips,
} from "#/features/fixed-costs/history/history-range-chips.tsx";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface FixedCostsHeroProps {
    /**
     * Monthly amount of the running fixed costs.
     */
    monthlyTotal: number;
}

/**
 * The monthly total of the running fixed costs, with the add button, and
 * below it the monthly total over the picked range with the changes behind
 * it. Fixed costs are read-only offline.
 */
export function FixedCostsHero({ monthlyTotal }: FixedCostsHeroProps) {
    const isOnline = useIsOnline();
    const history = useFixedCostHistory();
    const [range, setRange] = useState<HistoryRange>("all");

    const { months } = HISTORY_RANGES[range];
    const totals = Number.isFinite(months)
        ? history.totals.slice(-months)
        : history.totals;
    const first = totals[0];
    const firstMonthLabel = first
        ? formatMonthYear(fromIsoDate(`${first.month}-01`), getLocale())
        : "";
    const changes = first
        ? history.changes.filter((it) => it.month >= first.month)
        : [];

    return (
        <Card className={"gap-0 overflow-hidden p-0"}>
            <div className={"flex flex-wrap items-end gap-4 p-5"}>
                <div className={"flex grow flex-col gap-1"}>
                    <span
                        className={"text-label-large text-on-surface-variant"}
                    >
                        {m.fixed_cost_monthly_total()}
                    </span>
                    <span
                        className={
                            "font-brand text-display-medium text-on-surface"
                        }
                    >
                        {formatCurrency(monthlyTotal, getLocale())}
                    </span>
                    {first && (
                        <span
                            className={
                                "text-body-medium text-on-surface-variant"
                            }
                        >
                            {m.fixed_cost_history_since({
                                amount: formatCurrency(
                                    monthlyTotal - first.total,
                                    getLocale(),
                                    undefined,
                                    { signed: true },
                                ),
                                month: firstMonthLabel,
                            })}
                        </span>
                    )}
                </div>
                <OfflineHint active={!isOnline}>
                    {isOnline ? (
                        <Button variant={"filledTonal"} asChild>
                            <Link to={"/fixed-costs/new"}>
                                <Plus />
                                {m.fixed_cost_add()}
                            </Link>
                        </Button>
                    ) : (
                        <Button variant={"filledTonal"} disabled>
                            <Plus />
                            {m.fixed_cost_add()}
                        </Button>
                    )}
                </OfflineHint>
            </div>
            {first && (
                <>
                    <FixedCostHistoryChart totals={totals} />
                    <HistoryRangeChips
                        range={range}
                        onChange={setRange}
                        firstMonthLabel={firstMonthLabel}
                    />
                    {changes.length > 0 && (
                        <FixedCostChangeLog changes={changes} />
                    )}
                </>
            )}
        </Card>
    );
}
