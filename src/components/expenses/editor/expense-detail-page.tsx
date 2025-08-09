import { ArrowLeft, Check } from "lucide-react";
import { type FC, useRef, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import CurrencyInput, {
    type CurrencyInputProps,
} from "react-currency-input-field";
import { formatEuro } from "@/lib/currency-utils.ts";
import { type IconName } from "lucide-react/dynamic";
import { useAppDispatch } from "@/redux-hooks.ts";
import { upsertExpense } from "@/components/expenses/slice.ts";
import { nanoid } from "nanoid";
import { saveToLocalStorage } from "@/components/expenses/actions.ts";
import { useEncryption } from "@/components/use-encryption.ts";
import {
    categories,
    type Category,
} from "@/components/expenses/editor/categories.ts";
import { useRipple } from "@/hooks/use-ripple.ts";
import { CategoryTile } from "@/components/expenses/editor/category-tile.tsx";
import type { Expense } from "@/components/expense.ts";
import { DeleteButtonWithConfirmDialog } from "@/components/expenses/editor/delete-button-with-confirm-dialog.tsx";
import { DateChooserPopover } from "@/components/expenses/editor/date-chooser-popover.tsx";
import { ExpenseInput } from "@/components/expenses/editor/ExpenseInput.tsx";
import { SegmentedButton } from "@/components/ui/segmented-button.tsx";
import { useGitHubClient } from "@/gitHubClient.tsx";
import { useGitHubConfig } from "@/hooks/useGitHubConfig.ts";

const now = new Date();

type Props = {
    description?: string;
    id?: string;
    date?: Date;
    amount?: number;
    category?: Expense["category"];
    name?: string;
};

export const ExpenseDetailPage: FC<Props> = ({
    date,
    description,
    category,
    amount,
    id,
    name,
}) => {
    const dispatch = useAppDispatch();

    const { key } = useEncryption();
    const ripple = useRipple();
    const gitHubClient = useGitHubClient();
    const [gitHubConfig] = useGitHubConfig();

    const isEditing = id != null;
    const isAdding = !isEditing;

    const amountInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);

    const [selectedCategoryIconNameLocal, setSelectedCategoryIconNameLocal] =
        useState<string | undefined>(category?.iconName);
    const [descriptionLocal, setDescriptionLocal] = useState<string>(
        description ?? "",
    );
    const [dateLocal, setDateLocal] = useState<Date>(date ?? now);
    const [expenseLocal, setExpenseLocal] = useState(name ?? "");

    // Always positive amount string for input
    const [amountStr, setAmountStr] = useState<string>(
        isAdding ? "" : Math.abs(amount as number).toFixed(2),
    );
    const [transactionType, setTransactionType] = useState<
        "income" | "expense"
    >(isAdding ? "expense" : (amount as number) < 0 ? "income" : "expense");
    const [shouldShowSuggestions, setShouldShowSuggestions] =
        useState(isAdding);

    const onAmountInputChange: CurrencyInputProps["onValueChange"] = (
        value: string | undefined,
    ) => {
        setAmountStr(value ?? "");
    };

    function onSubmit() {
        if (!key || !gitHubConfig.gistId || !gitHubConfig.gistName) {
            return;
        }

        const positiveAmount = parseFloat(
            (amountStr as string).replace(",", "."),
        );
        const amount =
            transactionType === "expense"
                ? positiveAmount
                : positiveAmount * -1;

        const cat = categories.find(
            (x) => x.icon === (selectedCategoryIconNameLocal as string),
        );

        if (!cat || isNaN(positiveAmount) || !expenseLocal) {
            alert("Please select a category, specify an amount and a name.");
            return;
        }

        dispatch(
            upsertExpense({
                id: id ?? nanoid(8),
                date: dateLocal.getTime(),
                category: {
                    name: cat.name,
                    iconName: selectedCategoryIconNameLocal as IconName,
                    color: cat.color,
                },
                amount,
                amountFormatted: formatEuro(amount),
                name: expenseLocal,
                description: descriptionLocal,
            }),
        );

        void dispatch(
            saveToLocalStorage({
                key,
                gistId: gitHubConfig.gistId,
                apiClient: gitHubClient,
                gistName: gitHubConfig.gistName,
            }),
        );

        history.back();
    }

    function onCategoryTileClick(c: Category) {
        if (selectedCategoryIconNameLocal === c.icon) {
            setSelectedCategoryIconNameLocal(undefined);
        } else {
            setSelectedCategoryIconNameLocal(c.icon);
            if (isAdding) {
                setShouldShowSuggestions(true);
            }
            if (amountStr?.trim() === "") {
                amountInputRef?.current?.focus();
            }
        }
    }

    return (
        <>
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
                        <DeleteButtonWithConfirmDialog expenseId={id} />
                    )}

                    <button
                        type={"button"}
                        className={
                            "ripple-container bg-primary text-on-primary cursor-pointer rounded-full px-3 py-1"
                        }
                        data-ripple-color={"bg-on-primary/20"}
                        {...ripple}
                        onClick={(e) => {
                            ripple.onClick(e);

                            setTimeout(() => onSubmit(), 150);
                        }}
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
                            value: "income",
                            icon: "banknote-arrow-up",
                        },
                        {
                            label: "Ausgabe",
                            value: "expense",
                            icon: "banknote-arrow-down",
                        },
                    ]}
                    value={transactionType}
                    onChange={(e) => {
                        setTransactionType(e as "income" | "expense");
                    }}
                />
            </div>

            <div className={"container flex max-w-md flex-col"}>
                <div className={"flex flex-wrap"}>
                    {categories.map((c) => (
                        <CategoryTile
                            key={c.name}
                            selectedCategoryIconNameLocal={
                                selectedCategoryIconNameLocal
                            }
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
                        <label
                            htmlFor="amount"
                            className={"text-on-surface-variant"}
                        >
                            Preis
                        </label>
                        <CurrencyInput
                            ref={amountInputRef}
                            id="amount"
                            name="amount"
                            intlConfig={{
                                locale: "de-DE",
                                currency: "EUR",
                            }}
                            allowNegativeValue={false}
                            className={`h-8 w-full rounded-none border-none px-3 shadow-none outline-none focus-visible:ring-0`}
                            onValueChange={onAmountInputChange}
                            decimalsLimit={2}
                            value={amountStr}
                            step={1}
                        />
                    </div>
                    {selectedCategoryIconNameLocal != null && (
                        <ExpenseInput
                            shouldShowSuggestions={shouldShowSuggestions}
                            expenseLocal={expenseLocal}
                            onInputChange={(e) =>
                                setExpenseLocal(e.target.value)
                            }
                            onApplySuggestion={(e) => {
                                setExpenseLocal(e);
                                setShouldShowSuggestions(false);
                                if (descriptionInputRef.current) {
                                    descriptionInputRef.current.focus();
                                }
                            }}
                            categoryIconName={selectedCategoryIconNameLocal}
                        />
                    )}
                    <div className={"flex items-center gap-x-2"}>
                        <label
                            htmlFor="description"
                            className={"text-on-surface-variant"}
                        >
                            Beschreibung
                        </label>
                        <Input
                            ref={descriptionInputRef}
                            name={"description"}
                            value={descriptionLocal}
                            onChange={(e) => {
                                setDescriptionLocal(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();

                                    onSubmit();
                                }
                            }}
                            type={"text"}
                            className={
                                "rounded-none border-none shadow-none focus-visible:ring-0"
                            }
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
