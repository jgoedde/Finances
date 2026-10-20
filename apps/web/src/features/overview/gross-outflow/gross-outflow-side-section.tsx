import { Link } from "@tanstack/react-router";
import { formatCurrency, formatPercent } from "@finances/shared";
import {
    type GrossOutflowSide,
    SIDE_LABELS,
} from "#/features/overview/gross-outflow/gross-outflow.ts";
import { GrossOutflowFixedCostCategoryRow } from "#/features/overview/gross-outflow/gross-outflow-fixed-cost-category-row.tsx";
import { GrossOutflowRowLabel } from "#/features/overview/gross-outflow/gross-outflow-row-label.tsx";
import { getLocale } from "#/paraglide/runtime.js";

interface GrossOutflowSideSectionProps {
    side: GrossOutflowSide;
}

/**
 * Fixed costs or spending in the gross outflow list: a header with its
 * amount and share, then its categories. Spending categories open the
 * month's transactions of the category.
 */
export function GrossOutflowSideSection({
    side,
}: GrossOutflowSideSectionProps) {
    return (
        <section className={"flex flex-col"}>
            <h3
                className={`flex items-baseline gap-3 px-3 pt-2 pb-1
                    text-title-small text-on-surface-variant`}
            >
                <span className={"grow"}>{SIDE_LABELS[side.kind]()}</span>
                <span className={"text-label-large"}>
                    {`${formatCurrency(side.total, getLocale())} · ${formatPercent(side.share, getLocale())}`}
                </span>
            </h3>
            {side.categories.map((category) => {
                switch (category.kind) {
                    case "fixedCosts":
                        return (
                            <GrossOutflowFixedCostCategoryRow
                                key={category.id}
                                category={category}
                            />
                        );
                    case "spending":
                        return (
                            <Link
                                key={category.id}
                                to={"/transactions"}
                                search={{
                                    category: category.id,
                                    q: undefined,
                                    older: undefined,
                                }}
                                className={`state-layer flex min-h-12 items-center gap-3 rounded-md px-3 py-2 focus-ring`}
                            >
                                <GrossOutflowRowLabel {...category} />
                            </Link>
                        );
                    default:
                        throw new Error(
                            `unreachable error - type ${String(category satisfies never)}`,
                        );
                }
            })}
        </section>
    );
}
