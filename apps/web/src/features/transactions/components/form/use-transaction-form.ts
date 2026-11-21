import { type SubmitEvent, useRef, useState } from "react";
import { useBlocker } from "@tanstack/react-router";
import { isSameDay } from "date-fns";
import type { TransactionKind } from "@finances/shared";
import { confirmAction } from "#/components/confirm-dialog.tsx";
import * as haptics from "#/lib/haptics.ts";
import { useCounterpartyEntry } from "#/features/transactions/components/form/use-counterparty-entry.ts";
import { useSplitParts } from "#/features/transactions/components/form/use-split-parts.ts";
import {
    buildSubmitData,
    findInvalidPart,
    findMissingFields,
    getDateLockHint,
    getKindLockHint,
    type InitialFormValues,
    parseAmount,
    type RequiredField,
    type TransactionFormRelation,
    type TransactionFormSubmitData,
} from "#/features/transactions/components/form/transaction-form-model.ts";
import { useCategories } from "#/features/categories/category-queries.ts";
import { m } from "#/paraglide/messages.js";

interface TransactionFormOptions {
    initialValues: InitialFormValues;
    onSubmit: (data: TransactionFormSubmitData) => void;
    relation: TransactionFormRelation | undefined;
}

/**
 * The state of the {@link TransactionForm}: the entered values, what the
 * history predicts, validation and submitting.
 */
export function useTransactionForm({
    initialValues,
    onSubmit,
    relation,
}: TransactionFormOptions) {
    const categories = useCategories();

    const amountInputRef = useRef<HTMLInputElement>(null);
    const counterpartyInputRef = useRef<HTMLInputElement>(null);
    const categoryChipsRef = useRef<HTMLDivElement>(null);

    const { predict } = initialValues;
    const [missingFields, setMissingFields] = useState<RequiredField[]>([]);
    const entry = useCounterpartyEntry({
        rawCounterparty: initialValues.counterparty,
        predict,
        onEdit: () => clearMissing("counterparty"),
    });

    // Undefined until chosen, so the prediction can fill in.
    const [chosenCategoryId, setChosenCategoryId] = useState(
        initialValues.categoryId,
    );
    const [chosenKind, setChosenKind] = useState<TransactionKind | undefined>(
        predict ? undefined : initialValues.kind,
    );
    const [description, setDescription] = useState(initialValues.description);
    const [date, setDate] = useState(initialValues.date);
    const initialAmountStr = initialValues.amount?.toFixed(2) ?? "";
    const [amountStr, setAmountStr] = useState(initialAmountStr);
    const [isExceptional, setIsExceptional] = useState(
        initialValues.isExceptional,
    );

    const total = parseAmount(amountStr);
    const split = useSplitParts(total);
    const { counterparty, known } = entry;

    const categoryId = chosenCategoryId ?? known?.categoryId;
    const transactionType = chosenKind ?? known?.kind ?? initialValues.kind;
    const counterpartyError = missingFields.includes("counterparty")
        ? m.transaction_counterparty_missing()
        : undefined;

    // Expenses only get expense categories, incomes only income categories.
    const categoriesOfKind = categories.filter(
        (category) => category.kind === transactionType,
    );
    const selectedCategory = categoriesOfKind.find(
        (category) => category.id === categoryId,
    );

    const kindLockHint = getKindLockHint(relation);
    const dateLockHint = getDateLockHint(relation);

    // Values prefilled from a link don't count as changes.
    const isDirty =
        counterparty !== entry.initialCounterparty ||
        amountStr !== initialAmountStr ||
        chosenCategoryId !== initialValues.categoryId ||
        chosenKind !== (predict ? undefined : initialValues.kind) ||
        description !== initialValues.description ||
        date.getTime() !== initialValues.date.getTime() ||
        isExceptional !== initialValues.isExceptional ||
        split.parts.length > 0;

    // Asks before reloading or closing the tab with unsaved changes.
    useBlocker({
        shouldBlockFn: () => false,
        enableBeforeUnload: isDirty,
        disabled: !isDirty,
    });

    function clearMissing(field: RequiredField) {
        setMissingFields((fields) => fields.filter((it) => it !== field));
    }

    function handleFormSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedCounterparty = counterparty.trim();

        const missing = findMissingFields({
            total,
            trimmedCounterparty,
            category: selectedCategory,
        });

        setMissingFields(missing);
        if (missing.length > 0) {
            haptics.error();
        }
        switch (missing[0]) {
            case undefined:
                break;
            case "amount":
                amountInputRef.current?.focus();
                return;
            case "counterparty":
                counterpartyInputRef.current?.focus();
                return;
            case "category":
                categoryChipsRef.current?.querySelector("button")?.focus();
                return;
            default:
                throw new Error(
                    `unreachable error - type ${String(missing[0] satisfies never)}`,
                );
        }

        if (!selectedCategory) {
            return;
        }

        const invalid = findInvalidPart(split.parts);
        if (invalid || split.isRemainderInvalid) {
            haptics.error();
            split.showErrors();
            // The parts are a dynamic list, so they are found by id.
            const [first] = split.parts;
            const focusId = invalid
                ? `${invalid.part.key}-${invalid.field}`
                : `${first?.key}-amount`;
            document.getElementById(focusId)?.focus();
            return;
        }

        const data = buildSubmitData({
            total,
            remainder: split.remainder,
            trimmedCounterparty,
            category: selectedCategory,
            kind: transactionType,
            date,
            description,
            isExceptional,
            parts: split.parts,
        });
        // Moving a main expense to another day moves its attached expenses
        // along, so that asks first. Without a question this submits right
        // away, inside the gesture, so iOS still gives haptic feedback.
        const attachedCount =
            relation?.role === "main" ? relation.attachedCount : 0;
        if (attachedCount === 0 || isSameDay(date, initialValues.date)) {
            submit(data);
            return;
        }
        void confirmAction({
            title: m.transaction_move_attached_title(),
            description: m.transaction_move_attached_description({
                count: attachedCount,
            }),
            confirmLabel: m.transaction_move_attached_confirm(),
        }).then((isConfirmed) => isConfirmed && submit(data));
    }

    function submit(data: TransactionFormSubmitData) {
        haptics.saved();
        onSubmit(data);
    }

    /**
     * Switching the kind moves the transaction and every part onto the new
     * kind's fallback category, since the chosen ones are of the other kind.
     */
    function onKindChange(kind: TransactionKind) {
        if (kind === transactionType) {
            return;
        }
        const fallbackId = categories.find(
            (category) => category.fallback && category.kind === kind,
        )?.id;
        setChosenKind(kind);
        setChosenCategoryId(fallbackId);
        split.setCategoryOfAll(fallbackId);
        clearMissing("category");
    }

    function onCategorySelect(id: string) {
        setChosenCategoryId(id);
        clearMissing("category");
    }

    function changeAmount(value: string) {
        setAmountStr(value);
        clearMissing("amount");
    }

    return {
        amountInputRef,
        counterpartyInputRef,
        categoryChipsRef,
        entry,
        split,
        missingFields,
        counterpartyError,
        transactionType,
        categoryId,
        categoriesOfKind,
        selectedCategory,
        kindLockHint,
        dateLockHint,
        amountStr,
        changeAmount,
        date,
        setDate,
        description,
        setDescription,
        isExceptional,
        setIsExceptional,
        handleFormSubmit,
        onKindChange,
        onCategorySelect,
    };
}
