import {
    formatCurrency,
    formatMonthYear,
    type MonthlyFixedCostTotal,
} from "@finances/shared";
import { fromIsoDate } from "#/features/fixed-costs/fixed-cost.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

const MAX_ROWS = 6;

interface FixedCostHistoryTooltipProps {
    /**
     * The hovered month.
     */
    total: MonthlyFixedCostTotal;
}

/**
 * A month of the history graph: its total and its largest fixed costs with
 * their monthly amounts.
 */
export function FixedCostHistoryTooltip({
    total,
}: FixedCostHistoryTooltipProps) {
    const hidden = total.fixedCosts.length - MAX_ROWS;

    return (
        <div
            className={`flex max-w-72 min-w-56 flex-col gap-1 rounded-sm
                bg-surface-container-highest p-3 text-body-small text-on-surface
                shadow-elevation-2`}
        >
            <div className={"flex items-baseline justify-between gap-4"}>
                <span className={"text-label-medium text-on-surface-variant"}>
                    {formatMonthYear(
                        fromIsoDate(`${total.month}-01`),
                        getLocale(),
                    )}
                </span>
                <span className={"font-brand text-label-large"}>
                    {formatCurrency(total.total, getLocale())}
                </span>
            </div>
            {total.fixedCosts.slice(0, MAX_ROWS).map((it) => (
                <div key={it.fixedCost.id} className={"flex gap-2"}>
                    <span className={"min-w-0 grow truncate"}>
                        {it.fixedCost.name}
                    </span>
                    <span className={"shrink-0"}>
                        {formatCurrency(
                            it.monthlyAmount,
                            getLocale(),
                            it.fixedCost.currency,
                        )}
                    </span>
                </div>
            ))}
            {hidden > 0 && (
                <span className={"text-on-surface-variant"}>
                    {m.fixed_cost_history_more({ count: hidden })}
                </span>
            )}
        </div>
    );
}
