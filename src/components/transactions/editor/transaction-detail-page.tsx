import { ArrowLeft, Check } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import CurrencyInput from "react-currency-input-field";
import { useEncryption } from "@/components/use-encryption.ts";
import { CategoryTile } from "@/components/transactions/editor/category-tile.tsx";
import { DeleteButtonWithConfirmDialog } from "@/components/transactions/editor/delete-button-with-confirm-dialog.tsx";
import { DateChooserPopover } from "@/components/transactions/editor/date-chooser-popover.tsx";
import { TransactionInput } from "@/components/transactions/editor/TransactionInput.tsx";
import { SegmentedButton } from "@/components/ui/segmented-button.tsx";
import { nanoid } from "nanoid";
import { useNavigate } from "@tanstack/react-router";
import { transactionsRepository } from "@/persistence/repository.ts";
import {
    type Category,
    TransactionType,
    type TransactionWithCategory,
} from "@/persistence/types.ts";
import { useCategories } from "@/components/transactions/use-categories.ts";
import { Label } from "@/components/ui/label.tsx";

const now = new Date();

type Props = {
    transaction?: TransactionWithCategory;
};

export function TransactionDetailPage({ transaction }: Props) {
    const { key } = useEncryption();
    const navigate = useNavigate();

    const categories = useCategories();

    const isEditing = transaction != null;
    const isAdding = !isEditing;

    const amountInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);

    const [selectedCategoryId, setSelectedCategoryId] = useState<
        number | undefined
    >(transaction?.category_id);
    const [descriptionLocal, setDescriptionLocal] = useState<string>(
        transaction?.description ?? "",
    );
    const [dateLocal, setDateLocal] = useState<Date>(
        transaction?.date ? new Date(transaction.date) : now,
    );
    const [transactionLocal, setTransactionLocal] = useState(
        transaction?.name ?? "",
    );
    // Always positive amount string for input
    const [amountStr, setAmountStr] = useState<string>(
        isAdding ? "" : Math.abs(transaction?.amount as number).toFixed(2),
    );
    const [transactionType, setTransactionType] = useState<TransactionType>(
        isAdding
            ? TransactionType.expense
            : (transaction?.amount as number) < 0
              ? TransactionType.income
              : TransactionType.expense,
    );
    const [shouldShowSuggestions, setShouldShowSuggestions] =
        useState(isAdding);
    const [isExceptional, setIsExceptional] = useState(
        transaction?.exceptional ?? false,
    );

    const selectedCategory = categories.find(
        (category) => category.id === selectedCategoryId,
    );

    function onAmountInputChange(value: string | undefined) {
        setAmountStr(value ?? "");
    }

    function handleFormSubmit(event: FormEvent) {
        event.preventDefault();

        if (!key) {
            return;
        }

        const positiveAmount = parseFloat(
            (amountStr as string).replace(",", "."),
        );
        const amount =
            transactionType === TransactionType.expense
                ? positiveAmount
                : positiveAmount * -1;

        if (!selectedCategory || isNaN(positiveAmount) || !transactionLocal) {
            alert("Please select a category, specify an amount and a name.");
            return;
        }

        if (isAdding) {
            void transactionsRepository.add(
                {
                    id: nanoid(8),
                    date: dateLocal.getTime(),
                    category_id: selectedCategory.id,
                    amount: amount,
                    currency: "EUR",
                    name: transactionLocal,
                    description:
                        descriptionLocal.trim() === ""
                            ? undefined
                            : descriptionLocal.trim(),
                    exceptional: isExceptional,
                },
                key,
            );
        } else if (transaction) {
            transaction.amount = amount;
            transaction.currency = "EUR";
            transaction.date = dateLocal.getTime();
            transaction.category_id = selectedCategory.id;
            transaction.description =
                descriptionLocal.trim() === ""
                    ? undefined
                    : descriptionLocal.trim();
            transaction.name = transactionLocal;
            transaction.exceptional = isExceptional;

            void transactionsRepository.update(transaction, key);
        }

        void navigate({ to: "/" });
    }

    function onCategoryTileClick(c: Category) {
        if (selectedCategoryId === c.id) {
            setSelectedCategoryId(undefined);
        } else {
            setSelectedCategoryId(c.id);
            if (isAdding && transactionLocal.trim() === "") {
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
                <button
                    type={"button"}
                    onClick={() => {
                        history.back();
                    }}
                    className={"text-on-surface cursor-pointer px-4"}
                >
                    <ArrowLeft className={"size-6"} />
                </button>
                <div className={"text-lg"}>
                    {isAdding ? "Neue Geldbewegung" : "Geldbewegung bearbeiten"}
                </div>
                <div className={"ml-auto flex items-center gap-x-4 pr-4"}>
                    <DateChooserPopover
                        selected={dateLocal}
                        onSelect={(a) => setDateLocal(a ?? now)}
                    />

                    {isEditing && (
                        <DeleteButtonWithConfirmDialog
                            transactionId={transaction.id}
                        />
                    )}

                    <button
                        type={"submit"}
                        className={
                            "ripple-container bg-primary text-on-primary cursor-pointer rounded-full px-3 py-1"
                        }
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
                    {categories.map((c) => (
                        <CategoryTile
                            key={c.name}
                            selectedCategoryId={selectedCategoryId}
                            category={c}
                            onClick={() => onCategoryTileClick(c)}
                        />
                    ))}
                </div>

                <div
                    className={
                        "divide-outline-variant mt-2 flex w-full flex-col divide-y-1 px-2"
                    }
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
                            className={`h-8 w-full rounded-none border-none px-3 shadow-none outline-none focus-visible:ring-0`}
                            onValueChange={onAmountInputChange}
                            decimalsLimit={2}
                            value={amountStr}
                            step={1}
                        />
                    </div>
                    {selectedCategoryId != null && (
                        <TransactionInput
                            shouldShowSuggestions={shouldShowSuggestions}
                            transactionLocal={transactionLocal}
                            onInputChange={(e) => {
                                setTransactionLocal(e.target.value);

                                setShouldShowSuggestions(true);
                            }}
                            onApplySuggestion={(e) => {
                                setTransactionLocal(e);
                                setShouldShowSuggestions(false);
                                if (descriptionInputRef.current) {
                                    descriptionInputRef.current.focus();
                                }
                            }}
                            selectedCategoryId={selectedCategoryId}
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
                            value={descriptionLocal}
                            onChange={(e) => {
                                setDescriptionLocal(e.target.value);
                            }}
                            type={"text"}
                            className={
                                "rounded-none border-none shadow-none focus-visible:ring-0"
                            }
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
