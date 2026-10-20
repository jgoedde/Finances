import type { FixedCostCategoryGroup } from "#/features/fixed-costs/fixed-cost.ts";
import { m } from "#/paraglide/messages.js";
import { getRankedToneStyle } from "#/utils/color.ts";

interface FixedCostShareBarProps {
    /**
     * The groups with running fixed costs, largest first.
     */
    groups: FixedCostCategoryGroup[];
}

/**
 * The fixed cost categories' shares of the monthly total as one 100 %
 * stacked bar, largest first. Decorative: the list below carries the
 * numbers.
 */
export function FixedCostShareBar({ groups }: FixedCostShareBarProps) {
    return (
        <div
            role={"img"}
            aria-label={m.fixed_cost_breakdown_title()}
            className={"flex h-4 gap-0.5 overflow-hidden rounded-xs"}
        >
            {groups.map((group, rank) => (
                <div
                    key={group.category.id}
                    className={"min-w-0.5 bg-(--tone) ranked-tone"}
                    style={{
                        ...getRankedToneStyle(rank, groups.length),
                        flex: `${group.monthlyAmount} 0 0`,
                    }}
                />
            ))}
        </div>
    );
}
