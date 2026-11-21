import { type SubmitEvent, useRef, useState } from "react";
import { useBlocker } from "@tanstack/react-router";
import { isSameDay } from "date-fns";
import { confirmAction } from "#/components/confirm-dialog.tsx";
import * as haptics from "#/lib/haptics.ts";
import { ChevronDownIcon, SplitIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { Input } from "#/components/ui/input.tsx";
import { DeleteButton } from "#/components/delete-button.tsx";
import {
    CounterpartyHints,
    CounterpartyInput,
} from "#/features/transactions/components/form/counterparty-field.tsx";
import { CategoryChips } from "#/features/transactions/components/form/category-chips.tsx";
import { DateChips } from "#/features/transactions/components/form/date-chips.tsx";
import {
    SplitPartRow,
    type SplitPartDraft,
    type SplitPartField,
} from "#/features/transactions/components/form/split-part-row.tsx";
import { SegmentedButton } from "#/components/ui/segmented-button.tsx";
import {
    findCounterparty,
    formatCurrency,
    matchCounterparty,
    splitRemainder,
    type TransactionKind,
} from "@finances/shared";
import { useCounterparties } from "#/features/transactions/use-counterparties.ts";
import { counterpartyAliases } from "#/features/transactions/counterparty-aliases.ts";
import { Badge } from "#/components/ui/badge.tsx";
import { useCategories } from "#/features/categories/category-queries.ts";
import { Label } from "#/components/ui/label.tsx";
import { Checkbox } from "#/components/ui/checkbox.tsx";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field.tsx";
import { CurrencyInputWrapper } from "#/components/ui/currency-input-wrapper.tsx";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
    getCategoryName,
    getTransactionKindLabel,
} from "#/features/transactions/utils/transaction-utils.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

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

interface InitialFormValues {
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
 * The fields that can be missing, in the order of the form.
 */
type RequiredField = "amount" | "counterparty" | "category";

interface TransactionFormProps {
    initialValues: InitialFormValues;
    onDelete?: VoidFunction;
    onSubmit: (data: TransactionFormSubmitData) => void;
    title: string;

    /**
     * Offer splitting the total across categories (new transactions only).
     */
    canSplit?: boolean;
    relation?: TransactionFormRelation;
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
    canSplit = false,
    relation,
}: TransactionFormProps) {
    const categories = useCategories();

    const amountInputRef = useRef<HTMLInputElement>(null);
    const counterpartyInputRef = useRef<HTMLInputElement>(null);
    const categoryChipsRef = useRef<HTMLDivElement>(null);

    const { predict } = initialValues;
    const counterparties = useCounterparties();

    // The counterparty as it came in, e.g. "ALDI NORD 1234 HAMBURG" from a link.
    const rawCounterparty = initialValues.counterparty;
    const [learnedCounterparty] = useState(() =>
        predict && rawCounterparty.trim() !== ""
            ? counterpartyAliases.get(rawCounterparty)
            : undefined,
    );
    const [aliasedFrom, setAliasedFrom] = useState(
        learnedCounterparty !== undefined ? rawCounterparty : undefined,
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
    const initialCounterparty = learnedCounterparty ?? rawCounterparty;
    const initialAmountStr = initialValues.amount?.toFixed(2) ?? "";
    const [counterparty, setCounterparty] = useState(initialCounterparty);
    const [amountStr, setAmountStr] = useState(initialAmountStr);
    const [shouldShowSuggestions, setShouldShowSuggestions] = useState(predict);
    const [isExceptional, setIsExceptional] = useState(
        initialValues.isExceptional,
    );
    const [isMoreOpen, setIsMoreOpen] = useState(
        initialValues.description !== "" || initialValues.isExceptional,
    );
    const [missingFields, setMissingFields] = useState<RequiredField[]>([]);
    const [parts, setParts] = useState<SplitPartDraft[]>([]);
    const [shouldShowSplitErrors, setShouldShowSplitErrors] = useState(false);

    const known = predict
        ? findCounterparty(counterparties, counterparty)
        : undefined;
    const match =
        predict &&
        !isMatchDismissed &&
        aliasedFrom === undefined &&
        counterparty === rawCounterparty &&
        rawCounterparty.trim() !== ""
            ? matchCounterparty(counterparties, rawCounterparty)
            : undefined;

    const categoryId = chosenCategoryId ?? known?.categoryId;
    const transactionType = chosenKind ?? known?.kind ?? initialValues.kind;
    const lastAmount = amountStr === "" ? known?.lastAmount : undefined;
    const counterpartyError = missingFields.includes("counterparty")
        ? m.transaction_counterparty_missing()
        : undefined;

    const total = parseAmount(amountStr);
    const remainder = isNaN(total)
        ? undefined
        : splitRemainder(
              total,
              parts
                  .map((part) => parseAmount(part.amountStr))
                  .filter((amount) => amount > 0),
          );
    const isRemainderInvalid =
        parts.length > 0 && remainder !== undefined && remainder <= 0;

    // Expenses only get expense categories, incomes only income categories.
    const categoriesOfKind = categories.filter(
        (category) => category.kind === transactionType,
    );
    const selectedCategory = categoriesOfKind.find(
        (category) => category.id === categoryId,
    );

    const kindLockHint = getKindLockHint(relation);
    const dateLockHint =
        relation?.role === "attached"
            ? relation.mainExpenseCounterparty === undefined
                ? m.transaction_date_from_unknown_main_expense()
                : m.transaction_date_from_main_expense({
                      counterparty: relation.mainExpenseCounterparty,
                  })
            : undefined;

    // Values prefilled from a link don't count as changes.
    const isDirty =
        counterparty !== initialCounterparty ||
        amountStr !== initialAmountStr ||
        chosenCategoryId !== initialValues.categoryId ||
        chosenKind !== (predict ? undefined : initialValues.kind) ||
        description !== initialValues.description ||
        date.getTime() !== initialValues.date.getTime() ||
        isExceptional !== initialValues.isExceptional ||
        parts.length > 0;

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

        const missing: RequiredField[] = [];
        if (isNaN(total)) missing.push("amount");
        if (trimmedCounterparty === "") missing.push("counterparty");
        if (!selectedCategory) missing.push("category");

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

        const invalid = parts
            .map((part) => ({ part, field: findMissingInPart(part) }))
            .find(({ field }) => field !== undefined);
        if (invalid || isRemainderInvalid) {
            haptics.error();
            setShouldShowSplitErrors(true);
            // The parts are a dynamic list, so they are found by id.
            const [first] = parts;
            const focusId = invalid
                ? `${invalid.part.key}-${invalid.field}`
                : `${first?.key}-amount`;
            document.getElementById(focusId)?.focus();
            return;
        }

        const data: TransactionFormSubmitData = {
            isExceptional,
            date,
            description: trimOrNull(description),
            amount: remainder ?? total,
            categoryId: selectedCategory.id,
            kind: transactionType,
            counterparty: trimmedCounterparty,
            parts: parts.map((part) => ({
                amount: parseAmount(part.amountStr),
                categoryId: part.categoryId ?? selectedCategory.id,
                description: trimOrNull(part.description),
            })),
        };
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

    function addPart() {
        // A new, empty part isn't an error yet.
        setShouldShowSplitErrors(false);
        setParts((current) => [
            ...current,
            {
                key: `part-${nanoid(6)}`,
                amountStr: "",
                categoryId: undefined,
                description: "",
            },
        ]);
    }

    function updatePart(updated: SplitPartDraft) {
        setParts((current) =>
            current.map((part) => (part.key === updated.key ? updated : part)),
        );
    }

    function removePart(key: string) {
        setParts((current) => current.filter((part) => part.key !== key));
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
        setParts((current) =>
            current.map((part) => ({ ...part, categoryId: fallbackId })),
        );
        clearMissing("category");
    }

    function onCategorySelect(id: string) {
        setChosenCategoryId(id);
        clearMissing("category");
    }

    function pickCounterparty(picked: string) {
        setCounterparty(picked);
        clearMissing("counterparty");
        setShouldShowSuggestions(false);
    }

    function acceptMatch() {
        if (!match) {
            return;
        }
        pickCounterparty(match.name);
        counterpartyAliases.set(rawCounterparty, match.name);
        setAliasedFrom(rawCounterparty);
    }

    function undoAlias() {
        setCounterparty(rawCounterparty);
        counterpartyAliases.remove(rawCounterparty);
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
                <div className={"flex flex-col gap-2"}>
                    <SegmentedButton
                        disabled={kindLockHint !== undefined}
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
                            onKindChange(e as TransactionKind);
                        }}
                    />
                    {kindLockHint !== undefined && (
                        <FieldDescription>{kindLockHint}</FieldDescription>
                    )}
                </div>

                {/* Amount and counterparty share a row to save height;
                their hints go below it at full width. */}
                <div className={"flex flex-col gap-3"}>
                    <div
                        className={
                            "grid grid-cols-[minmax(0,3fr)_minmax(0,7fr)] gap-3"
                        }
                    >
                        <Field data-invalid={missingFields.includes("amount")}>
                            <FieldLabel htmlFor={"amount"}>
                                {m.transaction_amount()}
                            </FieldLabel>
                            <CurrencyInputWrapper
                                ref={amountInputRef}
                                id={"amount"}
                                name={"amount"}
                                // Narrow column: less padding leaves room
                                // for four digits and the currency.
                                className={"px-3 focus:px-[11px]"}
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
                                // Prefilled from a link, the keyboard would
                                // only cover the save button.
                                autoFocus={initialValues.amount === undefined}
                                aria-invalid={missingFields.includes("amount")}
                                aria-describedby={
                                    missingFields.includes("amount")
                                        ? "amount-error"
                                        : undefined
                                }
                                placeholder={
                                    lastAmount !== undefined
                                        ? formatCurrency(
                                              lastAmount,
                                              getLocale(),
                                          )
                                        : undefined
                                }
                            />
                        </Field>

                        <CounterpartyInput
                            ref={counterpartyInputRef}
                            value={counterparty}
                            onInputChange={(e) => {
                                setCounterparty(e.target.value);
                                clearMissing("counterparty");
                                setAliasedFrom(undefined);

                                setShouldShowSuggestions(true);
                            }}
                            kind={transactionType}
                            error={counterpartyError}
                        />
                    </div>

                    {missingFields.includes("amount") && (
                        <p
                            id={"amount-error"}
                            className={"px-4 text-body-small text-error"}
                        >
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

                    <CounterpartyHints
                        shouldShowSuggestions={shouldShowSuggestions}
                        value={counterparty}
                        counterparties={counterparties}
                        onPick={pickCounterparty}
                        match={match}
                        onAcceptMatch={acceptMatch}
                        aliasedFrom={aliasedFrom}
                        onUndoAlias={undoAlias}
                        error={counterpartyError}
                    />
                </div>

                <CategoryChips
                    ref={categoryChipsRef}
                    categories={categoriesOfKind}
                    selectedCategoryId={categoryId}
                    onSelect={onCategorySelect}
                    error={
                        missingFields.includes("category")
                            ? m.transaction_category_missing()
                            : undefined
                    }
                />

                {canSplit && (
                    <div className={"flex flex-col gap-3"}>
                        {/* Above the parts: the main transaction keeps what they leave. */}
                        {parts.length > 0 && remainder !== undefined && (
                            <p
                                className={cn(
                                    "px-4 text-body-small",
                                    isRemainderInvalid
                                        ? "text-error"
                                        : "text-on-surface-variant",
                                )}
                            >
                                {isRemainderInvalid
                                    ? m.transaction_split_too_much()
                                    : selectedCategory
                                      ? m.transaction_split_remainder({
                                            category: getCategoryName(
                                                selectedCategory.name,
                                            ),
                                            amount: formatCurrency(
                                                remainder,
                                                getLocale(),
                                            ),
                                        })
                                      : m.transaction_split_remainder_uncategorized(
                                            {
                                                amount: formatCurrency(
                                                    remainder,
                                                    getLocale(),
                                                ),
                                            },
                                        )}
                            </p>
                        )}
                        {parts.map((part) => (
                            <SplitPartRow
                                key={part.key}
                                part={part}
                                categories={categoriesOfKind}
                                onChange={updatePart}
                                onRemove={() => removePart(part.key)}
                                missing={
                                    shouldShowSplitErrors
                                        ? findMissingInPart(part)
                                        : undefined
                                }
                            />
                        ))}
                        <Button
                            type={"button"}
                            variant={"text"}
                            className={"-ml-3 self-start"}
                            onClick={addPart}
                        >
                            <SplitIcon aria-hidden />
                            {m.transaction_split()}
                        </Button>
                    </div>
                )}

                <DateChips
                    date={date}
                    onChange={setDate}
                    disabled={dateLockHint !== undefined}
                    hint={dateLockHint}
                />

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

function getKindLockHint(
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

/**
 * An entered amount, `NaN` when it isn't a number.
 */
function parseAmount(amountStr: string): number {
    return parseFloat(amountStr.replace(",", "."));
}

function trimOrNull(text: string): string | null {
    return text.trim() === "" ? null : text.trim();
}

function findMissingInPart(part: SplitPartDraft): SplitPartField | undefined {
    if (!(parseAmount(part.amountStr) > 0)) return "amount";
    if (part.categoryId === undefined) return "category";
    return undefined;
}
