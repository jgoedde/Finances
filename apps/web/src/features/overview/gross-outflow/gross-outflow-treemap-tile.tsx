import type { ReactNode } from "react";
import { formatCurrency, formatPercent } from "@finances/shared";
import { Link } from "@tanstack/react-router";
import type { TreemapNode } from "recharts";
import type { GrossOutflowTreemapDatum } from "#/features/overview/gross-outflow/gross-outflow-treemap.tsx";
import { getLocale } from "#/paraglide/runtime.js";

/**
 * Smallest tile (px) that shows the name; amount and share need more
 * height.
 */
const LABEL_MIN = { width: 72, nameHeight: 36, amountHeight: 56 } as const;

const TILE_CLASS_NAME = `state-layer flex size-full flex-col overflow-hidden
    rounded-xs border border-surface bg-(--tone) p-2 text-(--on-tone)
    focus-ring ranked-tone`;

interface GrossOutflowTreemapTileProps {
    node: TreemapNode;
}

/**
 * One tile of the gross outflow treemap, in its category's tone and
 * labelled where it fits. Fixed costs open their detail, spending
 * categories the month's transactions; sides and fixed cost categories
 * draw nothing of their own.
 */
export function GrossOutflowTreemapTile({
    node,
}: GrossOutflowTreemapTileProps) {
    const { x, y, width, height } = node;
    const { category, fixedCost } = node as TreemapNode &
        Partial<GrossOutflowTreemapDatum>;
    const leaf = fixedCost ?? (category?.kind === "spending" ? category : null);

    if (!category || !leaf) {
        return <g />;
    }

    const amount = formatCurrency(leaf.total, getLocale());
    const share = formatPercent(leaf.share, getLocale());
    const showName = width >= LABEL_MIN.width && height >= LABEL_MIN.nameHeight;
    const showAmount = showName && height >= LABEL_MIN.amountHeight;
    const label: ReactNode = (
        <>
            {showName && (
                <span className={"truncate text-label-large"}>{leaf.name}</span>
            )}
            {showAmount && (
                <span className={"truncate text-label-medium"}>
                    {`${amount} · ${share}`}
                </span>
            )}
        </>
    );
    const ariaLabel = `${leaf.name}, ${amount}, ${share}`;

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
            {fixedCost ? (
                <Link
                    to={"/fixed-costs/$id"}
                    params={{ id: fixedCost.id }}
                    aria-label={ariaLabel}
                    className={TILE_CLASS_NAME}
                    style={category.toneStyle}
                >
                    {label}
                </Link>
            ) : (
                <Link
                    to={"/transactions"}
                    search={{
                        category: category.id,
                        q: undefined,
                        older: undefined,
                    }}
                    aria-label={ariaLabel}
                    className={TILE_CLASS_NAME}
                    style={category.toneStyle}
                >
                    {label}
                </Link>
            )}
        </foreignObject>
    );
}
