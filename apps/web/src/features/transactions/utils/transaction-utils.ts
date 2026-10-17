import type { TransactionKind } from "@finances/shared";

const kindToLabelMap = {
    expense: "Ausgabe",
    income: "Einnahme",
} as const satisfies Record<TransactionKind, string>;

export function getTransactionKindLabel(kind: TransactionKind) {
    return kindToLabelMap[kind];
}
