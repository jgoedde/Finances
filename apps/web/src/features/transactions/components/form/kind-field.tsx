import type { TransactionKind } from "@finances/shared";
import IncomeIcon from "~icons/material-symbols/savings-outline-rounded";
import ExpenseIcon from "~icons/material-symbols/shopping-cart-outline-rounded";
import { SegmentedButton } from "#/components/ui/segmented-button.tsx";
import { FieldDescription } from "#/components/ui/field.tsx";
import { getTransactionKindLabel } from "#/features/transactions/utils/transaction-utils.ts";

interface KindFieldProps {
    value: TransactionKind;
    onChange: (kind: TransactionKind) => void;

    /**
     * Why the kind can't change; locks the field when set.
     */
    lockHint: string | undefined;
}

/**
 * Whether the transaction is an income or an expense.
 */
export function KindField({ value, onChange, lockHint }: KindFieldProps) {
    return (
        <div className={"flex flex-col gap-2"}>
            <SegmentedButton
                disabled={lockHint !== undefined}
                options={[
                    {
                        label: getTransactionKindLabel("income"),
                        value: "income",
                        icon: IncomeIcon,
                    },
                    {
                        label: getTransactionKindLabel("expense"),
                        value: "expense",
                        icon: ExpenseIcon,
                    },
                ]}
                value={value}
                onChange={(e) => {
                    onChange(e as TransactionKind);
                }}
            />
            {lockHint !== undefined && (
                <FieldDescription>{lockHint}</FieldDescription>
            )}
        </div>
    );
}
