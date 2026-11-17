import { TrendingDown, TrendingUp } from "lucide-react";
import { formatPercent, type Pattern } from "@finances/shared";
import { PatternRowLayout } from "#/features/overview/patterns/pattern-row-layout.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";
import { getCategoryName } from "#/features/transactions/utils/transaction-utils.ts";

interface CategoryDriftRowProps {
    pattern: Extract<Pattern, { kind: "categoryDrift" }>;
}

/**
 * "Groceries: +25 % per day vs. the 3 months before", opening the category.
 */
export function CategoryDriftRow({ pattern }: CategoryDriftRowProps) {
    const { category, change } = pattern;

    return (
        <PatternRowLayout
            icon={change > 0 ? <TrendingUp /> : <TrendingDown />}
            search={{ category: category.categoryId }}
        >
            {m.pattern_drift({
                category: getCategoryName(category.categoryName),
                change: formatPercent(change, getLocale(), { signed: true }),
            })}
        </PatternRowLayout>
    );
}
