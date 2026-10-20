import { Treemap } from "recharts";
import { ChartContainer, ChartTooltip } from "#/components/ui/chart.tsx";
import { FixedCostTreemapTile } from "#/features/fixed-costs/breakdown/fixed-cost-treemap-tile.tsx";
import { FixedCostTreemapTooltip } from "#/features/fixed-costs/breakdown/fixed-cost-treemap-tooltip.tsx";
import type {
    FixedCostCategoryGroup,
    FixedCostEntry,
} from "#/features/fixed-costs/fixed-cost.ts";
import { m } from "#/paraglide/messages.js";

/**
 * A node of the treemap: a fixed cost category, or one of its fixed costs
 * (`entry`). A `type`, so it fits recharts' index signature.
 */
export type FixedCostTreemapDatum = {
    name: string;
    value?: number;
    group: FixedCostCategoryGroup;
    entry?: FixedCostEntry;
    children?: FixedCostTreemapDatum[];
};

interface FixedCostTreemapProps {
    /**
     * The groups with running fixed costs, largest first.
     */
    groups: FixedCostCategoryGroup[];
}

/**
 * The running fixed costs as a treemap, nested by fixed cost category. A
 * tile's area is its monthly amount; each category has a tone of its own.
 * Tiles show name, amount and share where they fit; the tooltip names the
 * rest. Fixed cost tiles open their detail.
 */
export function FixedCostTreemap({ groups }: FixedCostTreemapProps) {
    const data = groups.map((group): FixedCostTreemapDatum => ({
        name: group.category.name,
        group,
        // Fixed costs not running today have no share and no tile.
        children: group.fixedCosts
            .filter((entry) => entry.share !== null)
            .map((entry) => ({
                name: entry.fixedCost.name,
                value: entry.fixedCost.monthlyAmount,
                group,
                entry,
            })),
    }));

    return (
        <ChartContainer
            config={{}}
            role={"figure"}
            aria-label={m.fixed_cost_breakdown_title()}
            className={"aspect-video w-full"}
        >
            <Treemap
                data={data}
                dataKey={"value"}
                nameKey={"name"}
                isAnimationActive={false}
                content={(node) => <FixedCostTreemapTile node={node} />}
            >
                <ChartTooltip
                    content={({ active, payload }) =>
                        active && (
                            <FixedCostTreemapTooltip
                                datum={
                                    payload[0]?.payload as
                                        FixedCostTreemapDatum | undefined
                                }
                            />
                        )
                    }
                />
            </Treemap>
        </ChartContainer>
    );
}
