import { formatCurrency, formatPercent } from "@finances/shared";
import type { FixedCostTreemapDatum } from "#/features/fixed-costs/breakdown/fixed-cost-treemap.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface FixedCostTreemapTooltipProps {
    /**
     * The hovered node.
     */
    datum: FixedCostTreemapDatum | undefined;
}

/**
 * Full name, monthly amount and share of a treemap tile, and of its fixed
 * cost category: for tiles too small or names too long to read.
 */
export function FixedCostTreemapTooltip({
    datum,
}: FixedCostTreemapTooltipProps) {
    if (!datum) {
        return null;
    }

    const { group, entry } = datum;
    const line = (amount: number, share: number | null, currency?: string) =>
        `${formatCurrency(amount, getLocale(), currency)} ${m.fixed_cost_per_month()} · ${formatPercent(share ?? 0, getLocale())}`;

    return (
        <div
            className={`flex max-w-64 flex-col gap-1 rounded-xs
                bg-inverse-surface px-2 py-1 text-body-small
                text-inverse-on-surface shadow-elevation-2`}
        >
            {entry && (
                <div className={"flex flex-col"}>
                    <span className={"text-label-medium"}>
                        {entry.fixedCost.name}
                    </span>
                    <span>
                        {line(
                            entry.fixedCost.monthlyAmount,
                            entry.share,
                            entry.fixedCost.currency,
                        )}
                    </span>
                </div>
            )}
            <div className={"flex items-center gap-2"}>
                <span
                    aria-hidden
                    className={"size-2.5 shrink-0 rounded-xs bg-(--tone) tone"}
                    style={group.toneStyle ?? undefined}
                />
                <div className={"flex flex-col"}>
                    <span className={"text-label-medium"}>
                        {group.category.name}
                    </span>
                    <span>{line(group.monthlyAmount, group.share)}</span>
                </div>
            </div>
        </div>
    );
}
