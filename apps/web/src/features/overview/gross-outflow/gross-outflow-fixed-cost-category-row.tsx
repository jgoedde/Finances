import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import type { GrossOutflowCategory } from "#/features/overview/gross-outflow/gross-outflow.ts";
import { GrossOutflowRowLabel } from "#/features/overview/gross-outflow/gross-outflow-row-label.tsx";
import { cn } from "#/lib/cn.ts";

interface GrossOutflowFixedCostCategoryRowProps {
    category: Extract<GrossOutflowCategory, { kind: "fixedCosts" }>;
}

/**
 * A fixed cost category in the gross outflow list. Expands to its fixed
 * costs, which open their detail. Starts collapsed.
 */
export function GrossOutflowFixedCostCategoryRow({
    category,
}: GrossOutflowFixedCostCategoryRowProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentId = `gross-outflow-fixed-cost-category-${category.id}`;

    return (
        <div className={"flex flex-col"}>
            <button
                type={"button"}
                aria-expanded={isExpanded}
                aria-controls={contentId}
                onClick={() => setIsExpanded(!isExpanded)}
                className={`state-layer flex min-h-12 w-full items-center gap-3
                    rounded-md px-3 py-2 text-left focus-ring`}
            >
                <GrossOutflowRowLabel {...category} />
                <ChevronDown
                    aria-hidden
                    className={cn(
                        `size-5 shrink-0 text-on-surface-variant
                        transition-transform duration-200 ease-standard`,
                        isExpanded && "rotate-180",
                    )}
                />
            </button>
            <div
                id={contentId}
                hidden={!isExpanded}
                className={"flex flex-col pl-6"}
            >
                {category.fixedCosts.map((fixedCost) => (
                    <Link
                        key={fixedCost.id}
                        to={"/fixed-costs/$id"}
                        params={{ id: fixedCost.id }}
                        className={`state-layer flex min-h-12 items-center gap-3
                        rounded-md px-3 py-2 focus-ring`}
                    >
                        <GrossOutflowRowLabel {...fixedCost} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
