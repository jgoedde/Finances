import { formatCurrency, type Transaction } from "@finances/shared";
import CloudUpload from "~icons/material-symbols/cloud-upload-outline-rounded";
import { usePendingChanges } from "#/features/sync/use-sync-status.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface TransactionListItemAmountProps {
    transaction: Transaction;

    /**
     * A main expense's occasion total, shown small below its own amount.
     */
    total: number | undefined;
    compact: boolean;
}

/**
 * The row's amount, with the occasion total and a hint while it isn't
 * synced yet.
 */
export function TransactionListItemAmount({
    transaction,
    total,
    compact,
}: TransactionListItemAmountProps) {
    const isPending = usePendingChanges().some(
        (change) => change.transaction.id === transaction.id,
    );

    return (
        <div
            className={cn(
                "flex shrink-0 items-center gap-x-2 text-on-surface",
                compact ? "text-label-medium" : "text-label-large",
                transaction.kind === "income" && "text-income",
            )}
        >
            {isPending && (
                <CloudUpload
                    role={"img"}
                    aria-label={m.sync_not_synced_yet()}
                    className={"size-4 text-on-surface-variant"}
                />
            )}
            <div className={"flex flex-col items-end"}>
                <div>
                    {transaction.kind === "income" && "+"}
                    {formatCurrency(transaction.amount, getLocale())}
                </div>
                {total !== undefined && (
                    <div className={"text-label-small text-on-surface-variant"}>
                        {m.transaction_main_expense_total({
                            amount: formatCurrency(total, getLocale()),
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
