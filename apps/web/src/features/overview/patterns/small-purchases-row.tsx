import { Coins } from "lucide-react";
import { formatCurrency, type Pattern } from "@finances/shared";
import { PatternRowLayout } from "#/features/overview/patterns/pattern-row-layout.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface SmallPurchasesRowProps {
    pattern: Extract<Pattern, { kind: "smallPurchases" }>;
}

/**
 * "23 purchases under 10 € add up to 87 €". Spread over many names and
 * categories, so it links nowhere.
 */
export function SmallPurchasesRow({ pattern }: SmallPurchasesRowProps) {
    const locale = getLocale();
    const values = {
        count: pattern.count,
        limit: formatCurrency(pattern.limit, locale),
        total: formatCurrency(pattern.total, locale),
    };

    return (
        <PatternRowLayout icon={<Coins />}>
            {pattern.topCounterparty
                ? m.pattern_small_top({
                      ...values,
                      name: pattern.topCounterparty,
                  })
                : m.pattern_small(values)}
        </PatternRowLayout>
    );
}
