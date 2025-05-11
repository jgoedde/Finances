import { ArrowLeft, CalendarFold, Plus } from "lucide-react";
import { useCallback, useRef, useState } from "react";
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
import { useExpenses } from "@/components/use-expenses.ts";
import { formatEuro } from "@/lib/currency-utils.ts";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

const categories: {
    name: string;
    icon: IconName;
    color: string;
}[] = [
    {
        name: "Auswärts essen",
        icon: "utensils",
        color: "#32CD32",
    },
    {
        name: "Einkäufe",
        icon: "shopping-basket",
        color: "#FFA500",
    },
    {
        name: "Geschenke",
        icon: "gift",
        color: "#FF6347",
    },
    {
        name: "Gesundheit",
        icon: "heart",
        color: "#32CD32",
    },
    {
        name: "Wohnung",
        icon: "sofa",
        color: "#9370DB",
    },
    {
        name: "Kleidung",
        icon: "shirt",
        color: "#00FA9A",
    },
    {
        name: "Freizeit",
        icon: "joystick",
        color: "#800080",
    },
    {
        name: "Urlaub",
        icon: "plane",
        color: "#87CEEB",
    },
];

export default function NewExpense() {
    const [, router] = useLocation();
    const { addExpense } = useExpenses();

    const amountRef = useRef<HTMLInputElement>(null);

    const [selected, setSelected] = useState<string>();
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [expense, setExpense] = useState("");

    const [amountStr, setAmountStr] = useState<string | undefined>("");
    const handleOnValueChange: CurrencyInputProps["onValueChange"] = (
        value: string | undefined,
    ) => {
        setAmountStr(value);
    };

    const onSubmit = useCallback(() => {
        const amount = parseFloat((amountStr as string).replace(",", "."));

        const cat = categories.find((x) => x.name === (selected as string));

        if (!cat) {
            alert("Please select a category");
            return;
        }

        addExpense({
            date: date.getTime(),
            category: {
                name: selected as string,
                iconName: cat.icon,
                color: cat.color,
            },
            amount,
            amountFormatted: formatEuro(amount),
            name: expense,
            description,
        });

        router("/");
    }, [addExpense, amountStr, date, description, expense, router, selected]);

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
                <div className={"text-lg"}>New expense</div>
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
                            selected={date}
                            onSelect={(a) => setDate(a ?? new Date())}
                            initialFocus
                        />
                    </PopoverContent>

                    <button
                        className={"cursor-pointer"}
                        onClick={() => {
                            onSubmit();
                        }}
                    >
                        <Plus />
                    </button>
                </div>
            </div>
            <div className={"container flex max-w-md flex-wrap"}>
                {categories.map((category) => (
                    <button
                        key={category.name}
                        style={{
                            ...(selected !== category.name &&
                                selected !== undefined && { opacity: 0.7 }),
                            backgroundColor: category.color,
                        }}
                        className={
                            "flex aspect-square size-1/3 flex-col text-left transition-opacity duration-150"
                        }
                        onClick={() => {
                            if (selected === category.name) {
                                setSelected(undefined);
                            } else {
                                setSelected(category.name);
                                if (amountStr?.trim() === "") {
                                    amountRef?.current?.focus();
                                }
                            }
                        }}
                    >
                        <div
                            className={cn(
                                "font-poppins line-clamp-2 px-2 text-2xl font-bold break-all",
                                selected === category.name
                                    ? "text-white"
                                    : "text-gray-100",
                            )}
                        >
                            {category.name}
                        </div>
                        <div
                            className={cn(
                                "mt-auto self-end justify-self-end p-2 transition-colors duration-75",
                                selected === category.name
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
                            ref={amountRef}
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
                            name={"expense"}
                            value={expense}
                            onChange={(e) => {
                                setExpense(e.target.value);
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
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
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
}
