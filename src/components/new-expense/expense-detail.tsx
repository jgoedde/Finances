import { ArrowLeft, Check, ClockFading, Trash } from "lucide-react";
import { type FC, useCallback, useRef, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import CurrencyInput, {
    type CurrencyInputProps,
} from "react-currency-input-field";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { formatEuro } from "@/lib/currency-utils.ts";
import { type IconName } from "lucide-react/dynamic";
import { useAppDispatch } from "@/hooks.ts";
import { removeExpense, upsertExpense } from "@/components/expenses/slice.ts";
import { nanoid } from "nanoid";
import { saveToLocalStorage } from "@/components/expenses/actions.ts";
import { useEncryption } from "@/components/use-encryption.ts";
import {
    categories,
    type Category,
} from "@/components/new-expense/categories.ts";
import type { Expense } from "@/components/use-expenses.ts";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { useRipple } from "@/hooks/use-ripple.ts";
import { CategoryTile } from "@/components/new-expense/category-tile.tsx";

type Props = {
    description?: string;
    id?: string;
    date?: Date;
    amount?: number;
    category?: Expense["category"];
    name?: string;
};

export const ExpenseDetail: FC<Props> = ({
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

    const amountInputRef = useRef<HTMLInputElement>(null);

    const [selectedCategoryIconNameLocal, setSelectedCategoryIconNameLocal] =
        useState<string | undefined>(category?.iconName);
    const [descriptionLocal, setDescriptionLocal] = useState<string>(
        description ?? "",
    );
    const [dateLocal, setDateLocal] = useState<Date>(date ?? new Date());
    const [expenseLocal, setExpenseLocal] = useState(name ?? "");
    const [amountStr, setAmountStr] = useState<string | undefined>(
        amount?.toFixed(2) ?? "",
    );

    const onAmountInputChange: CurrencyInputProps["onValueChange"] = (
        value: string | undefined,
    ) => {
        setAmountStr(value);
    };

    const onSubmit = useCallback(() => {
        if (!key) {
            return;
        }

        const amount = parseFloat((amountStr as string).replace(",", "."));

        const cat = categories.find(
            (x) => x.icon === (selectedCategoryIconNameLocal as string),
        );

        if (!cat) {
            alert("Please select a category");
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

        void dispatch(saveToLocalStorage({ encryptionKey: key }));

        history.back();
    }, [
        amountStr,
        dateLocal,
        descriptionLocal,
        dispatch,
        expenseLocal,
        id,
        key,
        selectedCategoryIconNameLocal,
    ]);

    const onDeleteConfirmButtonClick = useCallback(() => {
        if (!key || !id) {
            return;
        }

        dispatch(removeExpense(id));
        void dispatch(
            saveToLocalStorage({
                encryptionKey: key,
            }),
        );
    }, [key, dispatch, id]);

    const onCategoryTileClick = useCallback(
        (c: Category) => {
            if (selectedCategoryIconNameLocal === c.icon) {
                setSelectedCategoryIconNameLocal(undefined);
            } else {
                setSelectedCategoryIconNameLocal(c.icon);
                if (amountStr?.trim() === "") {
                    amountInputRef?.current?.focus();
                }
            }
        },
        [amountStr, selectedCategoryIconNameLocal],
    );

    return (
        <>
            <div
                className={
                    "bg-surface-container flex h-16 w-dvw items-center py-2"
                }
            >
                <button
                    onClick={() => {
                        history.back();
                    }}
                    className={"text-on-surface cursor-pointer px-4"}
                >
                    <ArrowLeft className={"size-6"} />
                </button>
                <div className={"text-lg"}>
                    {id === undefined ? "New expense" : "Update expense"}
                </div>
                <div className={"ml-auto flex items-center gap-x-4 pr-4"}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className={"cursor-pointer"}>
                                <ClockFading className={"size-5"} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto border-none p-0 shadow-lg">
                            <Calendar
                                weekStartsOn={1}
                                mode="single"
                                selected={dateLocal}
                                onSelect={(a) => setDateLocal(a ?? new Date())}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    {id !== undefined && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className={"cursor-pointer"}>
                                    <Trash className={"size-5"} />
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        remove this expense from your history.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel
                                        className={"text-primary"}
                                    >
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={onDeleteConfirmButtonClick}
                                        className={"text-primary"}
                                    >
                                        Yes
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    <button
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

                <form
                    className={
                        "divide-outline-variant mt-2 flex w-full flex-col divide-y-1 px-2"
                    }
                    onSubmit={(e) => {
                        e.preventDefault();

                        onSubmit();
                    }}
                >
                    <div className={"flex items-center gap-x-2"}>
                        <label
                            htmlFor="amount"
                            className={"text-on-surface-variant"}
                        >
                            Amount
                        </label>
                        <CurrencyInput
                            ref={amountInputRef}
                            id="amount"
                            name="amount"
                            intlConfig={{ locale: "de-DE", currency: "EUR" }}
                            className={`h-8 w-full rounded-none border-none px-3 shadow-none outline-none focus-visible:ring-0`}
                            onValueChange={onAmountInputChange}
                            decimalsLimit={2}
                            value={amountStr}
                            step={1}
                        />
                    </div>
                    <div className={"flex items-center gap-x-2"}>
                        <label
                            htmlFor="expense"
                            className={"text-on-surface-variant"}
                        >
                            Ausgabe
                        </label>
                        <Input
                            list={"frequent-expenses"}
                            name={"expense"}
                            value={expenseLocal}
                            onChange={(e) => {
                                setExpenseLocal(e.target.value);
                            }}
                            type={"text"}
                            className={
                                "rounded-none border-none shadow-none focus-visible:ring-0"
                            }
                        />
                    </div>
                    <div className={"flex items-center gap-x-2"}>
                        <label
                            htmlFor="description"
                            className={"text-on-surface-variant"}
                        >
                            Description
                        </label>
                        <Input
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
                </form>
            </div>
        </>
    );
};
