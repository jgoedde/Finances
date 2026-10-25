import { formatCurrency, formatPercent } from "@finances/shared";
import { Link } from "@tanstack/react-router";
import type { TreemapNode } from "recharts";
import type { FixedCostTreemapDatum } from "#/features/fixed-costs/breakdown/fixed-cost-treemap.tsx";
import { getLocale } from "#/paraglide/runtime.js";

/**
 * Smallest tile (px) that shows the name; amount and share need more
 * height.
 */
const LABEL_MIN = { width: 72, nameHeight: 36, amountHeight: 56 } as const;

interface FixedCostTreemapTileProps {
    node: TreemapNode;
}

/**
 * One tile of the fixed-cost treemap. Fixed costs draw a tile in their
 * category's tone, labelled where it fits, and open their detail; the root
 * and the categories draw nothing of their own.
 */
export function FixedCostTreemapTile({ node }: FixedCostTreemapTileProps) {
    const { x, y, width, height } = node;
    const { entry, group } = node as TreemapNode &
        Partial<FixedCostTreemapDatum>;

    if (!entry || !group) {
        return <g />;
    }

    const { fixedCost } = entry;
    const amount = formatCurrency(
        fixedCost.monthlyAmount,
        getLocale(),
        fixedCost.currency,
    );
    // Only running fixed costs get a tile, so the share is set.
    const share = formatPercent(entry.share ?? 0, getLocale());
    const showName = width >= LABEL_MIN.width && height >= LABEL_MIN.nameHeight;
    const showAmount = showName && height >= LABEL_MIN.amountHeight;

    // An HTML link, as the state layer and the focus ring don't draw on SVG
    // elements. Its border is the gap between tiles.
    return (
        <foreignObject
            x={x}
            y={y}
            width={width}
            height={height}
            className={"overflow-visible"}
        >
            <Link
                to={"/fixed-costs/$id"}
                params={{ id: fixedCost.id }}
                aria-label={`${fixedCost.name}, ${amount}, ${share}`}
                className={`state-layer flex size-full flex-col overflow-hidden
                    rounded-xs border border-surface bg-(--tone) p-2
                    text-(--on-tone) focus-ring tone`}
                style={group.toneStyle ?? undefined}
            >
                {showName && (
                    <span className={"truncate text-label-large"}>
                        {fixedCost.name}
                    </span>
                )}
                {showAmount && (
                    <span className={"truncate text-label-medium"}>
                        {`${amount} · ${share}`}
                    </span>
                )}
            </Link>
        </foreignObject>
    );
}
