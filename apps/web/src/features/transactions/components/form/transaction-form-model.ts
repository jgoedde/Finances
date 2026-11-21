import type { Category, TransactionKind } from "@finances/shared";
import type {
    SplitPartDraft,
    SplitPartField,
} from "#/features/transactions/components/form/split-part-row.tsx";
import { m } from "#/paraglide/messages.js";

export interface TransactionFormSubmitData {
    categoryId: string;
    counterparty: string;

    /**
     * Always positive; `kind` decides the direction. With parts, the total
     * minus the parts.
     */
    amount: number;
    date: Date;
    kind: TransactionKind;
    isExceptional: boolean;
    description: string | null;

    /**
     * Split off the total; each becomes its own transaction with the same
     * counterparty, date, kind and exceptional flag (an expense's parts are
     * attached to the remainder). Empty without a split.
     */
    parts: TransactionFormPart[];
}

interface TransactionFormPart {
    categoryId: string;

    /**
     * Always positive.
     */
    amount: number;
    description: string | null;
}

export interface InitialFormValues {
    counterparty: string;
    description: string;
    date: Date;
    kind: TransactionKind;
    isExceptional: boolean;

    /**
     * Guess from the history (new transactions): suggest counterparties,
     * match and replace raw ones, predict category and kind, hint the last
     * amount. Never overrides what the user chose.
     */
    predict: boolean;
    amount?: number;
    categoryId?: string;
}

/**
 * How an edited expense is tied to others, which locks fields: an attached
 * expense has its main expense's date and stays an expense; a main expense
 * with attached expenses stays an expense, and moving it moves them along.
 */
export type TransactionFormRelation =
    | {
          role: "attached";

          /**
           * Unknown when the main expense isn't cached.
           */
          mainExpenseCounterparty: string | undefined;
      }
    | { role: "main"; attachedCount: number };

/**
 * Id of the amount's error message.
 */
export const AMOUNT_ERROR_ID = "amount-error";

/**
 * The fields that can be missing, in the order of the form.
 */
export type RequiredField = "amount" | "counterparty" | "category";

export function getKindLockHint(
    relation: TransactionFormRelation | undefined,
): string | undefined {
    switch (relation?.role) {
        case undefined:
            return undefined;
        case "attached":
            return m.transaction_kind_locked_attached();
        case "main":
            return relation.attachedCount > 0
                ? m.transaction_kind_locked_main()
                : undefined;
        default:
            throw new Error(
                `unreachable error - type ${String(relation satisfies never)}`,
            );
    }
}

export function getDateLockHint(
    relation: TransactionFormRelation | undefined,
): string | undefined {
    if (relation?.role !== "attached") {
        return undefined;
    }
    return relation.mainExpenseCounterparty === undefined
        ? m.transaction_date_from_unknown_main_expense()
        : m.transaction_date_from_main_expense({
              counterparty: relation.mainExpenseCounterparty,
          });
}

/**
 * An entered amount, `NaN` when it isn't a number.
 */
export function parseAmount(amountStr: string): number {
    return parseFloat(amountStr.replace(",", "."));
}

function trimOrNull(text: string): string | null {
    return text.trim() === "" ? null : text.trim();
}

export function findMissingInPart(
    part: SplitPartDraft,
): SplitPartField | undefined {
    if (!(parseAmount(part.amountStr) > 0)) return "amount";
    if (part.categoryId === undefined) return "category";
    return undefined;
}

/**
 * The first part that can't be saved, with the value it lacks.
 */
export function findInvalidPart(
    parts: SplitPartDraft[],
): { part: SplitPartDraft; field: SplitPartField } | undefined {
    for (const part of parts) {
        const field = findMissingInPart(part);
        if (field !== undefined) {
            return { part, field };
        }
    }
    return undefined;
}

interface RequiredValues {
    total: number;
    trimmedCounterparty: string;
    category: Category | undefined;
}

/**
 * The required fields without a value, in the order of the form.
 */
export function findMissingFields({
    total,
    trimmedCounterparty,
    category,
}: RequiredValues): RequiredField[] {
    const missing: RequiredField[] = [];
    if (isNaN(total)) missing.push("amount");
    if (trimmedCounterparty === "") missing.push("counterparty");
    if (!category) missing.push("category");
    return missing;
}

interface SubmitValues {
    total: number;
    remainder: number | undefined;
    trimmedCounterparty: string;
    category: Category;
    kind: TransactionKind;
    date: Date;
    description: string;
    isExceptional: boolean;
    parts: SplitPartDraft[];
}

export function buildSubmitData({
    total,
    remainder,
    trimmedCounterparty,
    category,
    kind,
    date,
    description,
    isExceptional,
    parts,
}: SubmitValues): TransactionFormSubmitData {
    return {
        isExceptional,
        date,
        description: trimOrNull(description),
        amount: remainder ?? total,
        categoryId: category.id,
        kind,
        counterparty: trimmedCounterparty,
        parts: parts.map((part) => ({
            amount: parseAmount(part.amountStr),
            categoryId: part.categoryId ?? category.id,
            description: trimOrNull(part.description),
        })),
    };
}
