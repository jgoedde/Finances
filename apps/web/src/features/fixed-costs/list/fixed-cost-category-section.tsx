import { useState } from "react";
import { formatCurrency, formatPercent } from "@finances/shared";
import { ChevronDown } from "lucide-react";
import type { FixedCostCategoryGroup } from "#/features/fixed-costs/fixed-cost.ts";
import { FixedCostCategoryColorPicker } from "#/features/fixed-costs/list/fixed-cost-category-color-picker.tsx";
import { FixedCostListItem } from "#/features/fixed-costs/list/fixed-cost-list-item.tsx";
import { cn } from "#/lib/cn.ts";
import { getLocale } from "#/paraglide/runtime.js";

interface FixedCostCategorySectionProps {
    group: FixedCostCategoryGroup;
}

/**
 * A fixed cost category of the list: a header with its color (which opens
 * the color picker), monthly amount and share, which expands to its fixed
 * costs. Starts expanded. Without running fixed costs, the header shows
 * neither color nor numbers.
 */
export function FixedCostCategorySection({
    group,
}: FixedCostCategorySectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const contentId = `fixed-cost-category-${group.category.id}`;

    return (
        <section className={"flex flex-col"}>
            <div className={"flex items-center gap-1 pl-1"}>
                <FixedCostCategoryColorPicker
                    category={group.category}
                    isColored={group.toneStyle !== null}
                />
                <h2 className={"min-w-0 grow"}>
                    <button
                        type={"button"}
                        aria-expanded={isExpanded}
                        aria-controls={contentId}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`state-layer flex min-h-12 w-full
                            items-center gap-3 rounded-md py-2 pr-4 pl-2
                            text-left focus-ring`}
                    >
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
                                {formatCurrency(
                                    group.monthlyAmount,
                                    getLocale(),
                                )}
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
            </div>
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
