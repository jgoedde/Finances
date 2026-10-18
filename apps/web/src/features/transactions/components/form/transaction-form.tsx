import { type SubmitEvent, useRef, useState } from "react";
import { Input } from "#/components/ui/input.tsx";
import { CategoryTile } from "#/features/transactions/components/form/category-tile.tsx";
import { DeleteButton } from "#/components/delete-button.tsx";
import { showInfo } from "#/components/info-dialog.tsx";
import { showInfo } from "#/components/info-dialog.tsx";
import { DateChooserPopover } from "#/features/transactions/components/form/date-chooser-popover.tsx";
import { TransactionInput } from "#/features/transactions/components/form/transaction-input.tsx";
import { SegmentedButton } from "#/components/ui/segmented-button.tsx";
import type { Category, TransactionKind } from "@finances/shared";
import { useCategories } from "#/features/transactions/transaction-queries.ts";
import { Label } from "#/components/ui/label.tsx";
import { CurrencyInput } from "react-currency-input-field";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { Button } from "#/components/ui/button.tsx";
import { SelectedCategoryBadge } from "#/features/transactions/components/form/selected-category-badge.tsx";
import { getTransactionKindLabel } from "#/features/transactions/utils/transaction-utils.ts";
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
    showSuggestions: boolean;
    amount?: number;
    categoryId?: string;
}

interface Props {
    initialValues: InitialFormValues;
    onDelete?: VoidFunction;
    onSubmit: (data: TransactionFormSubmitData) => void;
    title: string;
}

export function TransactionForm({
    initialValues,
    onDelete,
    onSubmit,
    title,
}: Props) {
    const categories = useCategories();

    const amountInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);

    const [categoryId, setCategoryId] = useState(initialValues.categoryId);
    const [description, setDescription] = useState(initialValues.description);
    const [date, setDate] = useState(initialValues.date);
    const [name, setName] = useState(initialValues.name);
    const [amountStr, setAmountStr] = useState(
        initialValues.amount?.toFixed(2) ?? "",
    );
    const [transactionType, setTransactionType] = useState<TransactionKind>(
        initialValues.kind,
    );
    const [shouldShowSuggestions, setShouldShowSuggestions] = useState(
        initialValues.showSuggestions,
    );
    const [isExceptional, setIsExceptional] = useState(
        initialValues.isExceptional,
    );

    const selectedCategory = categories.find(
        (category) => category.id === categoryId,
    );

    function onAmountInputChange(value: string | undefined) {
        setAmountStr(value ?? "");
    }

    function handleFormSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const amount = parseFloat(amountStr.replace(",", "."));

        if (!selectedCategory || isNaN(amount) || !name) {
            void showInfo({
                title: m.transaction_form_incomplete_title(),
                description: m.transaction_form_incomplete(),
            });
            return;
        }

        onSubmit({
            isExceptional,
            date,
            description: description.trim() === "" ? null : description.trim(),
            amount,
            categoryId: selectedCategory.id,
            kind: transactionType,
            name,
        });
    }

    function onCategoryTileClick(c: Category) {
        if (categoryId === c.id) {
            setCategoryId(undefined);
        } else {
            setCategoryId(c.id);
            if (initialValues.showSuggestions && name.trim() === "") {
                setShouldShowSuggestions(true);
            }
            if (amountStr?.trim() === "") {
                amountInputRef?.current?.focus();
            }
        }
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <TopAppBar
                title={title}
                actions={
                    <>
                        <DateChooserPopover
                            selected={date}
                            onSelect={(a) => setDate(a ?? new Date())}
                        />

                        {typeof onDelete === "function" && (
                            <DeleteButton
                                title={m.transaction_delete_title()}
                                description={m.transaction_delete_description()}
                                onDelete={onDelete}
                            />
                        )}

                        <Button type={"submit"} variant={"text"}>
                            {m.action_save()}
                        </Button>
                    </>
                }
            />

            <div className={"my-4 flex w-full justify-center"}>
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
                        setTransactionType(e as TransactionKind);
                    }}
                />
            </div>

            <div className={"mx-auto flex w-full max-w-md flex-col"}>
                <div className={"flex flex-wrap"}>
                    {selectedCategory === undefined &&
                        categories.map((c) => (
                            <CategoryTile
                                key={c.name}
                                selectedCategoryId={categoryId}
                                category={c}
                                onClick={() => onCategoryTileClick(c)}
                            />
                        ))}
                </div>

                <div
                    className={`mt-2 flex w-full flex-col divide-y
                        divide-outline-variant px-2`}
                >
                    <div
                        className={"flex items-center justify-between gap-x-2"}
                    >
                        <Label
                            htmlFor="amount"
                            className={`shrink-0 text-body-large
                                text-on-surface-variant`}
                        >
                            {m.transaction_amount()}
                        </Label>
                        <CurrencyInput
                            ref={amountInputRef}
                            id="amount"
                            name="amount"
                            intlConfig={{
                                locale: getLocale(),
                                currency: "EUR",
                            }}
                            required
                            allowNegativeValue={false}
                            className={`h-12 w-full bg-transparent px-3
                                text-body-large text-on-surface outline-none`}
                            onValueChange={onAmountInputChange}
                            decimalsLimit={2}
                            value={amountStr}
                            step={1}
                        />
                    </div>
                    {categoryId != null && (
                        <TransactionInput
                            shouldShowSuggestions={shouldShowSuggestions}
                            transactionLocal={name}
                            onInputChange={(e) => {
                                setName(e.target.value);

                                setShouldShowSuggestions(true);
                            }}
                            onApplySuggestion={(e) => {
                                setName(e);
                                setShouldShowSuggestions(false);
                                if (descriptionInputRef.current) {
                                    descriptionInputRef.current.focus();
                                }
                            }}
                            selectedCategoryId={categoryId}
                            isExceptional={isExceptional}
                            onExceptionalCheckBoxClick={(val) => {
                                setIsExceptional(val);
                            }}
                            transactionType={transactionType}
                        />
                    )}
                    <div className={"flex items-center gap-x-2"}>
                        <Label
                            htmlFor="description"
                            className={`shrink-0 text-body-large
                                text-on-surface-variant`}
                        >
                            {m.transaction_description()}
                        </Label>
                        <Input
                            ref={descriptionInputRef}
                            name={"description"}
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                            type={"text"}
                            className={`h-12 rounded-none border-none px-3
                                focus:border-none focus:px-3`}
                        />
                    </div>
                    {selectedCategory !== undefined && (
                        <div className={"mt-4 ml-auto"}>
                            <SelectedCategoryBadge
                                category={selectedCategory}
                                onClear={() => setCategoryId(undefined)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
