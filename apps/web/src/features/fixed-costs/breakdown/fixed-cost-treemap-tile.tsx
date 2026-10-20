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
    const { entry, toneStyle } = node as TreemapNode &
        Partial<FixedCostTreemapDatum>;

    if (!entry) {
        return <g />;
    }

    const amount = formatCurrency(entry.fixedCost.monthlyAmount, getLocale());
    // Only running fixed costs get a tile, so the share is set.
    const share = formatPercent(entry.share ?? 0, getLocale());
    const showName = width >= LABEL_MIN.width && height >= LABEL_MIN.nameHeight;
    const showAmount = showName && height >= LABEL_MIN.amountHeight;

    return (
        <Link
            to={"/fixed-costs/$id"}
            params={{ id: entry.fixedCost.id }}
            aria-label={`${entry.fixedCost.name}, ${amount}, ${share}`}
            className={"transition-opacity ranked-tone hover:opacity-88"}
            style={toneStyle}
        >
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={4}
                strokeWidth={2}
                className={"fill-(--tone) stroke-surface"}
            />
            {showName && (
                <foreignObject
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    className={"pointer-events-none"}
                >
                    <div
                        className={`flex size-full flex-col overflow-hidden p-2
                        text-(--on-tone)`}
                    >
                        <span className={"truncate text-label-large"}>
                            {entry.fixedCost.name}
                        </span>
                        {showAmount && (
                            <span className={"truncate text-label-medium"}>
                                {`${amount} · ${share}`}
                            </span>
                        )}
                    </div>
                </foreignObject>
            )}
        </Link>
    );
}
