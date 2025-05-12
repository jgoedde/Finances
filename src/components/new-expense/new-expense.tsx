import { ArrowLeft, CalendarFold, Plus, Save } from "lucide-react";
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
import { cn } from "@/lib/utils.ts";
import { Calendar } from "@/components/ui/calendar.tsx";
import { useLocation } from "wouter";
import { formatEuro } from "@/lib/currency-utils.ts";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useAppDispatch } from "@/hooks.ts";
import { upsertExpense } from "@/components/expenses/slice.ts";
import { nanoid } from "nanoid";
import { saveToLocalStorage } from "@/components/expenses/actions.ts";
import { useEncryption } from "@/components/use-encryption.ts";
import { categories } from "@/components/new-expense/categories.ts";
import type { Expense } from "@/components/use-expenses.ts";

type Props = {
    description?: string;
    id?: string;
    date?: Date;
    amount?: number;
    category?: Expense["category"];
    name?: string;
};

export const NewExpense: FC<Props> = ({
    date,
    description,
    category,
    amount,
    id,
    name,
}) => {
    const dispatch = useAppDispatch();
    const { key } = useEncryption();

    const [, router] = useLocation();

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

    const handleOnValueChange: CurrencyInputProps["onValueChange"] = (
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

        router("/");
    }, [
        amountStr,
        dateLocal,
        descriptionLocal,
        dispatch,
        expenseLocal,
        id,
        key,
        router,
        selectedCategoryIconNameLocal,
    ]);

    return (
        <Popover>
            <div
                className={
                    "bg-surface flex h-[48px] w-dvw items-center gap-x-4 px-4 py-2"
                }
            >
                <button
                    onClick={() => {
                        router("/");
                    }}
                    className={"text-on-surface cursor-pointer"}
                >
                    <ArrowLeft className={"size-6"} />
                </button>
                <div className={"text-lg"}>
                    {id === undefined ? "New expense" : "Update expense"}
                </div>
                <div className={"ml-auto flex items-center gap-x-3"}>
                    <PopoverTrigger asChild>
                        <button className={"cursor-pointer"}>
                            <CalendarFold className={"size-5"} />
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

                    <button
                        className={"cursor-pointer"}
                        onClick={() => {
                            onSubmit();
                        }}
                    >
                        {id === undefined ? <Plus /> : <Save />}
                    </button>
                </div>
            </div>
            <div className={"container flex max-w-md flex-wrap"}>
                {categories.map((category) => (
                    <button
                        key={category.name}
                        style={{
                            ...(selectedCategoryIconNameLocal !==
                                category.icon &&
                                selectedCategoryIconNameLocal !== undefined && {
                                    opacity: 0.5,
                                }),
                            backgroundColor: category.color,
                        }}
                        className={
                            "flex aspect-square size-1/3 flex-col text-left transition-opacity duration-150"
                        }
                        onClick={() => {
                            if (
                                selectedCategoryIconNameLocal === category.icon
                            ) {
                                setSelectedCategoryIconNameLocal(undefined);
                            } else {
                                setSelectedCategoryIconNameLocal(category.icon);
                                if (amountStr?.trim() === "") {
                                    amountInputRef?.current?.focus();
                                }
                            }
                        }}
                    >
                        <div
                            className={cn(
                                "font-poppins line-clamp-2 px-2 text-2xl font-bold break-all",
                                selectedCategoryIconNameLocal === category.icon
                                    ? "text-white"
                                    : "text-gray-100",
                            )}
                        >
                            {category.name}
                        </div>
                        <div
                            className={cn(
                                "mt-auto self-end justify-self-end p-2 transition-colors duration-75",
                                selectedCategoryIconNameLocal === category.icon
                                    ? "text-white"
                                    : "text-inverse-primary",
                            )}
                        >
                            <DynamicIcon
                                name={category.icon}
                                className={"size-14"}
                            />
                        </div>
                    </button>
                ))}

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
                            onValueChange={handleOnValueChange}
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
        </Popover>
    );
};
