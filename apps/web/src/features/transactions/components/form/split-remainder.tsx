import { type Category, formatCurrency } from "@finances/shared";
import { getCategoryName } from "#/features/transactions/utils/transaction-utils.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface SplitRemainderProps {
    remainder: number;
    isInvalid: boolean;

    /**
     * The main transaction's category, which keeps the remainder.
     */
    category: Category | undefined;
}

/**
 * What the main transaction keeps of a split total.
 */
export function SplitRemainder({
    remainder,
    isInvalid,
    category,
}: SplitRemainderProps) {
    const amount = formatCurrency(remainder, getLocale());
    return (
        <p
            className={cn(
                "px-4 text-body-small",
                isInvalid ? "text-error" : "text-on-surface-variant",
            )}
        >
            {isInvalid
                ? m.transaction_split_too_much()
                : category
                  ? m.transaction_split_remainder({
                        category: getCategoryName(category.name),
                        amount,
                    })
                  : m.transaction_split_remainder_uncategorized({ amount })}
        </p>
    );
}
