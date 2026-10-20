import { formatCurrency, formatPercent } from "@finances/shared";
import type { GrossOutflowTreemapDatum } from "#/features/overview/gross-outflow/gross-outflow-treemap.tsx";
import { getLocale } from "#/paraglide/runtime.js";

interface GrossOutflowTreemapTooltipProps {
    /**
     * The hovered node.
     */
    datum: GrossOutflowTreemapDatum | undefined;
}

/**
 * Full name, amount and share of a treemap tile, and of its fixed cost
 * category: for tiles too small or names too long to read.
 */
export function GrossOutflowTreemapTooltip({
    datum,
}: GrossOutflowTreemapTooltipProps) {
    if (!datum?.category) {
        return null;
    }

    const { category, fixedCost } = datum;
    const line = (total: number, share: number) =>
        `${formatCurrency(total, getLocale())} · ${formatPercent(share, getLocale())}`;

    return (
        <div
            className={`flex max-w-64 flex-col gap-1 rounded-xs
                bg-inverse-surface px-2 py-1 text-body-small
                text-inverse-on-surface shadow-elevation-2`}
        >
            {fixedCost && (
                <div className={"flex flex-col"}>
                    <span className={"text-label-medium"}>
                        {fixedCost.name}
                    </span>
                    <span>{line(fixedCost.total, fixedCost.share)}</span>
                </div>
            )}
            <div className={"flex items-center gap-2"}>
                <span
                    aria-hidden
                    className={
                        "size-2.5 shrink-0 rounded-xs bg-(--tone) ranked-tone"
                    }
                    style={category.toneStyle}
                />
                <div className={"flex flex-col"}>
                    <span className={"text-label-medium"}>{category.name}</span>
                    <span>{line(category.total, category.share)}</span>
                </div>
            </div>
        </div>
    );
}
