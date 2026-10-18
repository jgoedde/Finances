import { type SubmitEvent, useRef, useState } from "react";
import { useBlocker } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import { Input } from "#/components/ui/input.tsx";
import { DeleteButton } from "#/components/delete-button.tsx";
import { CounterpartyField } from "#/features/transactions/components/form/counterparty-field.tsx";
import { CategoryChips } from "#/features/transactions/components/form/category-chips.tsx";
import { DateChips } from "#/features/transactions/components/form/date-chips.tsx";
import { SegmentedButton } from "#/components/ui/segmented-button.tsx";
import {
    findCounterparty,
    formatCurrency,
    matchCounterparty,
    type TransactionKind,
} from "@finances/shared";
import { useCounterparties } from "#/features/transactions/use-counterparties.ts";
import { counterpartyAliases } from "#/features/transactions/counterparty-aliases.ts";
import { Badge } from "#/components/ui/badge.tsx";
import { useCategories } from "#/features/transactions/transaction-queries.ts";
import { Label } from "#/components/ui/label.tsx";
import { Checkbox } from "#/components/ui/checkbox.tsx";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { CurrencyInputWrapper } from "#/components/ui/currency-input-wrapper.tsx";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { Button } from "#/components/ui/button.tsx";
import { getTransactionKindLabel } from "#/features/transactions/utils/transaction-utils.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

export interface TransactionFormSubmitData {
    categoryId: string;
    name: string;

    /**
     * Always positive; `kind` decides the direction.
     */
    amount: number;
    date: Date;
    kind: TransactionKind;
    isExceptional: boolean;
    description: string | null;
}

interface InitialFormValues {
    name: string;
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
 * The fields that can be missing, in the order of the form.
 */
type RequiredField = "amount" | "name" | "category";

interface TransactionFormProps {
    initialValues: InitialFormValues;
    onDelete?: VoidFunction;
    onSubmit: (data: TransactionFormSubmitData) => void;
    title: string;
}

/**
 * Form for creating or editing a transaction: amount, counterparty and
 * category first, everything else prefilled or tucked away.
 */
export function TransactionForm({
    initialValues,
    onDelete,
    onSubmit,
    title,
}: TransactionFormProps) {
    const categories = useCategories();

    const amountInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const categoryChipsRef = useRef<HTMLDivElement>(null);

    const { predict } = initialValues;
    const counterparties = useCounterparties();

    // The name as it came in, e.g. "ALDI NORD 1234 HAMBURG" from a link.
    const rawName = initialValues.name;
    const [learnedName] = useState(() =>
        predict && rawName.trim() !== ""
            ? counterpartyAliases.get(rawName)
            : undefined,
    );
    const [aliasedFrom, setAliasedFrom] = useState(
        learnedName !== undefined ? rawName : undefined,
    );
    const [isMatchDismissed, setIsMatchDismissed] = useState(false);

    // Undefined until chosen, so the prediction can fill in.
    const [chosenCategoryId, setChosenCategoryId] = useState(
        initialValues.categoryId,
    );
    const [chosenKind, setChosenKind] = useState<TransactionKind | undefined>(
        predict ? undefined : initialValues.kind,
    );
    const [description, setDescription] = useState(initialValues.description);
    const [date, setDate] = useState(initialValues.date);
    const initialName = learnedName ?? rawName;
    const initialAmountStr = initialValues.amount?.toFixed(2) ?? "";
    const [name, setName] = useState(initialName);
    const [amountStr, setAmountStr] = useState(initialAmountStr);
    const [shouldShowSuggestions, setShouldShowSuggestions] = useState(predict);
    const [isExceptional, setIsExceptional] = useState(
        initialValues.isExceptional,
    );
    const [isMoreOpen, setIsMoreOpen] = useState(
        initialValues.description !== "" || initialValues.isExceptional,
    );
    const [missingFields, setMissingFields] = useState<RequiredField[]>([]);

    const known = predict ? findCounterparty(counterparties, name) : undefined;
    const match =
        predict &&
        !isMatchDismissed &&
        aliasedFrom === undefined &&
        name === rawName &&
        rawName.trim() !== ""
            ? matchCounterparty(counterparties, rawName)
            : undefined;

    const categoryId = chosenCategoryId ?? known?.categoryId;
    const transactionType = chosenKind ?? known?.kind ?? initialValues.kind;
    const lastAmount = amountStr === "" ? known?.lastAmount : undefined;

    const selectedCategory = categories.find(
        (category) => category.id === categoryId,
    );

    // Values prefilled from a link don't count as changes.
    const isDirty =
        name !== initialName ||
        amountStr !== initialAmountStr ||
        chosenCategoryId !== initialValues.categoryId ||
        chosenKind !== (predict ? undefined : initialValues.kind) ||
        description !== initialValues.description ||
        date.getTime() !== initialValues.date.getTime() ||
        isExceptional !== initialValues.isExceptional;

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

        const amount = parseFloat(amountStr.replace(",", "."));
        const trimmedName = name.trim();

        const missing: RequiredField[] = [];
        if (isNaN(amount)) missing.push("amount");
        if (trimmedName === "") missing.push("name");
        if (!selectedCategory) missing.push("category");

        setMissingFields(missing);
        switch (missing[0]) {
            case undefined:
                break;
            case "amount":
                amountInputRef.current?.focus();
                return;
            case "name":
                nameInputRef.current?.focus();
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

        onSubmit({
            isExceptional,
            date,
            description: description.trim() === "" ? null : description.trim(),
            amount,
            categoryId: selectedCategory.id,
            kind: transactionType,
            name: trimmedName,
        });
    }

    function onCategorySelect(id: string) {
        setChosenCategoryId(id);
        clearMissing("category");
    }

    function pickName(picked: string) {
        setName(picked);
        clearMissing("name");
        setShouldShowSuggestions(false);
    }

    function acceptMatch() {
        if (!match) {
            return;
        }
        pickName(match.name);
        counterpartyAliases.set(rawName, match.name);
        setAliasedFrom(rawName);
    }

    function undoAlias() {
        setName(rawName);
        counterpartyAliases.remove(rawName);
        setAliasedFrom(undefined);
        setIsMatchDismissed(true);
    }

    return (
        <form onSubmit={handleFormSubmit} className={"flex min-h-dvh flex-col"}>
            <TopAppBar
                title={title}
                actions={
                    typeof onDelete === "function" && (
                        <DeleteButton
                            title={m.transaction_delete_title()}
                            description={m.transaction_delete_description()}
                            onDelete={onDelete}
                        />
                    )
                }
            />

            <div
                className={`mx-auto flex w-full max-w-md grow flex-col gap-6
                    px-4 pt-2 pb-6`}
            >
                <SegmentedButton
                    options={[
                        {
                            label: getTransactionKindLabel("income"),
                            value: "income",
                            icon: "banknote-arrow-up",
                        },
                        {
                            label: getTransactionKindLabel("expense"),
                            value: "expense",
                            icon: "banknote-arrow-down",
                        },
                    ]}
                    value={transactionType}
                    onChange={(e) => {
                        setChosenKind(e as TransactionKind);
                    }}
                />

                <Field data-invalid={missingFields.includes("amount")}>
                    <FieldLabel htmlFor={"amount"}>
                        {m.transaction_amount()}
                    </FieldLabel>
                    <CurrencyInputWrapper
                        ref={amountInputRef}
                        id={"amount"}
                        name={"amount"}
                        inputMode={"decimal"}
                        intlConfig={{
                            locale: getLocale(),
                            currency: "EUR",
                        }}
                        allowNegativeValue={false}
                        onValueChange={(value) => {
                            setAmountStr(value ?? "");
                            clearMissing("amount");
                        }}
                        decimalsLimit={2}
                        value={amountStr}
                        step={1}
                        autoComplete={"off"}
                        // Prefilled from a link, the keyboard would only
                        // cover the save button.
                        autoFocus={initialValues.amount === undefined}
                        aria-invalid={missingFields.includes("amount")}
                        placeholder={
                            lastAmount !== undefined
                                ? formatCurrency(lastAmount, getLocale())
                                : undefined
                        }
                    />
                    {missingFields.includes("amount") && (
                        <p className={"px-4 text-body-small text-error"}>
                            {m.transaction_amount_missing()}
                        </p>
                    )}
                    {lastAmount !== undefined && (
                        <Badge asChild variant={"md3"}>
                            <button
                                type={"button"}
                                onClick={() => {
                                    setAmountStr(lastAmount.toFixed(2));
                                    clearMissing("amount");
                                }}
                            >
                                {m.transaction_amount_last({
                                    amount: formatCurrency(
                                        lastAmount,
                                        getLocale(),
                                    ),
                                })}
                            </button>
                        </Badge>
                    )}
                </Field>

                <CounterpartyField
                    ref={nameInputRef}
                    shouldShowSuggestions={shouldShowSuggestions}
                    value={name}
                    counterparties={counterparties}
                    onInputChange={(e) => {
                        setName(e.target.value);
                        clearMissing("name");
                        setAliasedFrom(undefined);

                        setShouldShowSuggestions(true);
                    }}
                    onPick={pickName}
                    match={match}
                    onAcceptMatch={acceptMatch}
                    aliasedFrom={aliasedFrom}
                    onUndoAlias={undoAlias}
                    kind={transactionType}
                    error={
                        missingFields.includes("name")
                            ? m.transaction_counterparty_missing()
                            : undefined
                    }
                />

                <CategoryChips
                    ref={categoryChipsRef}
                    categories={categories}
                    selectedCategoryId={categoryId}
                    onSelect={onCategorySelect}
                    error={
                        missingFields.includes("category")
                            ? m.transaction_category_missing()
                            : undefined
                    }
                />

                <DateChips date={date} onChange={setDate} />

                <div className={"flex flex-col gap-4"}>
                    <Button
                        type={"button"}
                        variant={"text"}
                        className={"-ml-3 self-start"}
                        aria-expanded={isMoreOpen}
                        aria-controls={"transaction-more"}
                        onClick={() => setIsMoreOpen((open) => !open)}
                    >
                        {m.transaction_more()}
                        <ChevronDownIcon
                            aria-hidden
                            className={cn(
                                `transition-transform duration-200
                                ease-standard`,
                                isMoreOpen && "rotate-180",
                            )}
                        />
                    </Button>
                    {isMoreOpen && (
                        <div
                            id={"transaction-more"}
                            className={"flex flex-col gap-4"}
                        >
                            <Field>
                                <FieldLabel htmlFor={"description"}>
                                    {m.transaction_description()}
                                </FieldLabel>
                                <Input
                                    id={"description"}
                                    name={"description"}
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                    type={"text"}
                                />
                            </Field>
                            <div className={"flex items-center gap-x-4"}>
                                <Checkbox
                                    id={"exceptional"}
                                    name={"exceptional"}
                                    checked={isExceptional}
                                    onCheckedChange={(checked) =>
                                        setIsExceptional(checked === true)
                                    }
                                />
                                <Label
                                    htmlFor={"exceptional"}
                                    className={
                                        "text-body-large text-on-surface"
                                    }
                                >
                                    {m.transaction_exceptional()}
                                </Label>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Compact: sticks to the bottom, within the thumb's reach. */}
            <footer
                className={`sticky bottom-0 border-t border-outline-variant
                    bg-surface px-4 pt-4
                    pb-[calc(1rem+env(safe-area-inset-bottom))] medium:static
                    medium:border-none medium:pt-0`}
            >
                <div className={"mx-auto flex w-full max-w-md justify-end"}>
                    <Button
                        type={"submit"}
                        variant={"filled"}
                        className={"w-full medium:w-auto"}
                    >
                        {m.action_save()}
                    </Button>
                </div>
            </footer>
        </form>
    );
}
