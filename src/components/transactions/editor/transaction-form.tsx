import { Check } from "lucide-react";
import { type SubmitEvent, useRef, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { CategoryTile } from "@/components/transactions/editor/category-tile.tsx";
import { DeleteButtonWithConfirmDialog } from "@/components/transactions/editor/delete-button-with-confirm-dialog.tsx";
import { DateChooserPopover } from "@/components/transactions/editor/date-chooser-popover.tsx";
import { TransactionInput } from "@/components/transactions/editor/transaction-input.tsx";
import { SegmentedButton } from "@/components/ui/segmented-button.tsx";
import { type Category, TransactionType } from "@/persistence/types.ts";
import { useCategories } from "@/components/transactions/use-categories.ts";
import { Label } from "@/components/ui/label.tsx";
import { CurrencyInput } from "react-currency-input-field";
import { BackArrowButton } from "@/components/ui/back-arrow-button.tsx";
import { SelectedCategoryBadge } from "@/components/transactions/editor/selected-category-badge.tsx";

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
            <div
                className={
                    "bg-surface-container flex h-16 w-dvw items-center py-2"
                }
            >
                <BackArrowButton />
                <div className={"text-lg"}>{title}</div>
                <div className={"ml-auto flex items-center gap-x-4 pr-4"}>
                    <DateChooserPopover
                        selected={date}
                        onSelect={(a) => setDate(a ?? new Date())}
                    />

                    {typeof onDelete === "function" && (
                        <DeleteButtonWithConfirmDialog onDelete={onDelete} />
                    )}

                    <button
                        type={"submit"}
                        className={`ripple-container bg-primary text-on-primary
                            cursor-pointer rounded-full px-3 py-1`}
                    >
                        <Check className={"size"} />
                    </button>
                </div>
            </div>

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

            <div className={"container flex max-w-md flex-col"}>
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
                            className={"text-on-surface-variant"}
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
                            className={`h-8 w-full rounded-none border-none px-3
                                shadow-none outline-none focus-visible:ring-0`}
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
                            className={"text-on-surface-variant"}
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
                            className={`rounded-none border-none shadow-none
                                focus-visible:ring-0`}
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
