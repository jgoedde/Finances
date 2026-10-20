import { useState } from "react";
import { formatCurrency, formatPercent } from "@finances/shared";
import { ChevronDown } from "lucide-react";
import type { FixedCostCategoryGroup } from "#/features/fixed-costs/fixed-cost.ts";
import { FixedCostListItem } from "#/features/fixed-costs/list/fixed-cost-list-item.tsx";
import { cn } from "#/lib/cn.ts";
import { getLocale } from "#/paraglide/runtime.js";
import { getRankedToneStyle } from "#/utils/color.ts";

interface FixedCostCategorySectionProps {
    group: FixedCostCategoryGroup;

    /**
     * Number of groups with running fixed costs, for the tone.
     */
    rankCount: number;
}

/**
 * A fixed cost category of the list: a header with its tone, monthly amount
 * and share, which expands to its fixed costs. Starts expanded. Without
 * running fixed costs, the header shows neither tone nor numbers.
 */
export function FixedCostCategorySection({
    group,
    rankCount,
}: FixedCostCategorySectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const contentId = `fixed-cost-category-${group.category.id}`;

    return (
        <section className={"flex flex-col"}>
            <h2>
                <button
                    type={"button"}
                    aria-expanded={isExpanded}
                    aria-controls={contentId}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`state-layer flex min-h-12 w-full items-center
                        gap-3 rounded-md px-4 py-2 text-left focus-ring`}
                >
                    <span
                        aria-hidden
                        className={cn(
                            "size-3 shrink-0 rounded-full",
                            group.rank === null
                                ? "border border-outline"
                                : "bg-(--tone) ranked-tone",
                        )}
                        style={
                            group.rank === null
                                ? undefined
                                : getRankedToneStyle(group.rank, rankCount)
                        }
                    />
                    <span
                        title={group.category.name}
                        className={`min-w-0 grow truncate text-title-small
                            text-on-surface`}
                    >
                        {group.category.name}
                    </span>
                    {group.share !== null && (
                        <span
                            className={
                                "shrink-0 text-label-large text-on-surface"
                            }
                        >
                            {formatCurrency(group.monthlyAmount, getLocale())}
                            <span className={"text-on-surface-variant"}>
                                {` · ${formatPercent(group.share, getLocale())}`}
                            </span>
                        </span>
                    )}
                    <ChevronDown
                        aria-hidden
                        className={cn(
                            `size-5 shrink-0 text-on-surface-variant
                            transition-transform duration-200 ease-standard`,
                            isExpanded && "rotate-180",
                        )}
                    />
                </button>
            </h2>
            {isExpanded && (
                <div id={contentId} className={"flex flex-col gap-y-1.5 px-2"}>
                    {group.fixedCosts.map((it) => (
                        <FixedCostListItem
                            key={it.fixedCost.id}
                            fixedCost={it.fixedCost}
                            share={it.share}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
