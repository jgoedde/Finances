import type { Category, Transaction } from "@finances/shared";
import ChevronRight from "~icons/material-symbols/chevron-right-rounded";
import CornerDownRight from "~icons/material-symbols/subdirectory-arrow-right-rounded";
import { getCategoryName } from "#/features/transactions/utils/transaction-utils.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

interface TransactionListItemTextProps {
    transaction: Transaction;
    category: Category | undefined;
    dateLabel: string | undefined;
    mainExpense: Transaction | undefined;
    compact: boolean;
}

/**
 * The row's headline, supporting text and "belongs to" hint.
 */
export function TransactionListItemText({
    transaction,
    category,
    dateLabel,
    mainExpense,
    compact,
}: TransactionListItemTextProps) {
    function getSupportingText() {
        if (transaction.description != null) {
            return transaction.description;
        }

        if (category) {
            return getCategoryName(category.name);
        }

        return m.transaction_no_description();
    }

    // A compact row leads with what the attached expense was for (the
    // counterparty is often the main expense's) and names its counterparty and category below.
    const headline = compact
        ? (transaction.description ?? transaction.counterparty)
        : transaction.counterparty;
    const supportingText = compact
        ? [
              transaction.description != null && transaction.counterparty,
              category && getCategoryName(category.name),
          ]
              .filter(Boolean)
              .join(" · ")
        : getSupportingText();

    return (
        <div className={"flex min-w-0 flex-1 flex-col"}>
            <div
                className={cn(
                    "inline-flex items-center gap-x-1 text-on-surface",
                    compact ? "text-body-medium" : "text-body-large",
                )}
            >
                {headline}
                {!compact && (
                    <ChevronRight
                        className={"size-4 shrink-0 text-on-surface-variant"}
                    />
                )}
            </div>
            <div
                className={cn(
                    "line-clamp-2 break-all text-on-surface-variant",
                    compact ? "text-body-small" : "text-body-medium",
                )}
            >
                {dateLabel === undefined
                    ? supportingText
                    : `${dateLabel} · ${supportingText}`}
            </div>
            {mainExpense && (
                <div
                    className={`inline-flex items-center gap-x-1
                    text-body-small text-on-surface-variant`}
                >
                    <CornerDownRight className={"size-3.5 shrink-0"} />
                    {m.transaction_belongs_to({
                        counterparty: mainExpense.counterparty,
                    })}
                </div>
            )}
        </div>
    );
}
