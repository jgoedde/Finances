import { TransactionType } from "@/persistence/types.ts";

const typeToLabelMap = {
    [TransactionType.expense]: "Ausgabe",
    [TransactionType.income]: "Einnahme",
} as const;

export function getTransactionTypeLabel(type: TransactionType) {
    return typeToLabelMap[type];
}

export function getTransactionType(amount: number): TransactionType {
    return amount < 0 ? TransactionType.income : TransactionType.expense;
}
