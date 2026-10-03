import { type SubmitEvent, useRef, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { CategoryTile } from "@/features/transactions/components/form/category-tile.tsx";
import { DeleteButtonWithConfirmDialog } from "@/features/transactions/components/form/delete-button-with-confirm-dialog.tsx";
import { DateChooserPopover } from "@/features/transactions/components/form/date-chooser-popover.tsx";
import { TransactionInput } from "@/features/transactions/components/form/transaction-input.tsx";
import { SegmentedButton } from "@/components/ui/segmented-button.tsx";
import { type Category, TransactionType } from "@/persistence/types.ts";
import { useCategories } from "@/features/transactions/use-categories.ts";
import { Label } from "@/components/ui/label.tsx";
import { CurrencyInput } from "react-currency-input-field";
import { TopAppBar } from "@/components/ui/top-app-bar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SelectedCategoryBadge } from "@/features/transactions/components/form/selected-category-badge.tsx";

export interface TransactionFormSubmitData {
    categoryId: number;
    name: string;
    amount: number;
    date: Date;
    type: TransactionType;
    isExceptional: boolean;
    description?: string;
}

interface InitialFormValues {
    name: string;
    description: string;
    date: Date;
    type: TransactionType;
    isExceptional: boolean;
    showSuggestions: boolean;
    amount?: number;
    categoryId?: number;
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
    const [transactionType, setTransactionType] = useState<TransactionType>(
        initialValues.type,
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

        const positiveAmount = parseFloat(
            (amountStr as string).replace(",", "."),
        );
        const amount =
            transactionType === TransactionType.expense
                ? positiveAmount
                : positiveAmount * -1;

        if (!selectedCategory || isNaN(positiveAmount) || !name) {
            alert("Please select a category, specify an amount and a name.");
            return;
        }

        onSubmit({
            isExceptional,
            date,
            description:
                description.trim() === "" ? undefined : description.trim(),
            amount,
            categoryId: selectedCategory.id,
            type: transactionType,
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
                            <DeleteButtonWithConfirmDialog
                                onDelete={onDelete}
                            />
                        )}

                        <Button type={"submit"} variant={"text"}>
                            Speichern
                        </Button>
                    </>
                }
            />

            <div className={"my-4 flex w-full justify-center"}>
                <SegmentedButton
                    options={[
                        {
                            label: "Einnahme",
                            value: TransactionType.income,
                            icon: "banknote-arrow-up",
                        },
                        {
                            label: "Ausgabe",
                            value: TransactionType.expense,
                            icon: "banknote-arrow-down",
                        },
                    ]}
                    value={transactionType}
                    onChange={(e) => {
                        setTransactionType(e as TransactionType);
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
                    className={`divide-outline-variant mt-2 flex w-full flex-col
                        divide-y px-2`}
                >
                    <div
                        className={"flex items-center justify-between gap-x-2"}
                    >
                        <Label
                            htmlFor="amount"
                            className={`text-on-surface-variant text-body-large
                                shrink-0`}
                        >
                            Preis
                        </Label>
                        <CurrencyInput
                            ref={amountInputRef}
                            id="amount"
                            name="amount"
                            intlConfig={{
                                locale: "de-DE",
                                currency: "EUR",
                            }}
                            required
                            allowNegativeValue={false}
                            className={`text-body-large text-on-surface h-12
                                w-full bg-transparent px-3 outline-none`}
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
                            className={`text-on-surface-variant text-body-large
                                shrink-0`}
                        >
                            Beschreibung
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
