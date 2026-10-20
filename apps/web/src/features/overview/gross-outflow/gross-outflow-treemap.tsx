import { Treemap } from "recharts";
import { ChartContainer, ChartTooltip } from "#/components/ui/chart.tsx";
import type {
    GrossOutflowCategory,
    GrossOutflowFixedCost,
    GrossOutflowView,
} from "#/features/overview/gross-outflow/gross-outflow.ts";
import { GrossOutflowTreemapTile } from "#/features/overview/gross-outflow/gross-outflow-treemap-tile.tsx";
import { GrossOutflowTreemapTooltip } from "#/features/overview/gross-outflow/gross-outflow-treemap-tooltip.tsx";
import { m } from "#/paraglide/messages.js";

/**
 * A node of the treemap: a side, a category, or a fixed cost of a fixed
 * cost category. A `type`, so it fits recharts' index signature.
 */
export type GrossOutflowTreemapDatum = {
    name: string;
    value?: number;
    category?: GrossOutflowCategory;
    fixedCost?: GrossOutflowFixedCost;
    children?: GrossOutflowTreemapDatum[];
};

interface GrossOutflowTreemapProps {
    outflow: GrossOutflowView;
}

/**
 * The gross outflow as a treemap: fixed costs and spending, then their
 * categories, then the fixed costs of each fixed cost category. A tile's
 * area is its amount. Tiles show name, amount and share where they fit;
 * the tooltip names the rest. Fixed costs open their detail, spending
 * categories the month's transactions.
 */
export function GrossOutflowTreemap({ outflow }: GrossOutflowTreemapProps) {
    const data = outflow.sides.map((side): GrossOutflowTreemapDatum => ({
        name: side.kind,
        children: side.categories.map((category) => {
            switch (category.kind) {
                case "fixedCosts":
                    return {
                        name: category.name,
                        category,
                        children: category.fixedCosts.map((fixedCost) => ({
                            name: fixedCost.name,
                            value: fixedCost.total,
                            category,
                            fixedCost,
                        })),
                    };
                case "spending":
                    return {
                        name: category.name,
                        value: category.total,
                        category,
                    };
                default:
                    throw new Error(
                        `unreachable error - type ${String(category satisfies never)}`,
                    );
            }
        }),
    }));

    return (
        <ChartContainer
            config={{}}
            role={"figure"}
            aria-label={m.overview_gross_outflow_title()}
            className={"aspect-video w-full"}
        >
            <Treemap
                data={data}
                dataKey={"value"}
                nameKey={"name"}
                isAnimationActive={false}
                content={(node) => <GrossOutflowTreemapTile node={node} />}
            >
                <ChartTooltip
                    content={({ active, payload }) =>
                        active && (
                            <GrossOutflowTreemapTooltip
                                datum={
                                    payload[0]?.payload as
                                        GrossOutflowTreemapDatum | undefined
                                }
                            />
                        )
                    }
                />
            </Treemap>
        </ChartContainer>
    );
}
