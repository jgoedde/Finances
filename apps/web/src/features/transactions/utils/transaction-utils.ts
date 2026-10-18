import type { TransactionKind } from "@finances/shared";
import { m } from "#/paraglide/messages.js";

const kindToLabelMap = {
    expense: m.kind_expense,
    income: m.kind_income,
} as const satisfies Record<TransactionKind, () => string>;

export function getTransactionKindLabel(kind: TransactionKind): string {
    return kindToLabelMap[kind]();
}
