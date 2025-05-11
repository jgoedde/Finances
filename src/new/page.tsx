import {
    ArrowLeft,
    Calendar1,
    CalendarFold,
    Gift,
    Heart,
    Joystick,
    Plane,
    Plus,
    Shirt,
    ShoppingBasket,
    Sofa,
    Utensils,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const categories = [
    {
        name: "Auswärts essen",
        icon: <Utensils className={"size-14"} />,
        color: "#32CD32",
    },
    {
        name: "Einkäufe",
        icon: <ShoppingBasket className={"size-14"} />,
        color: "#FFA500",
    },
    {
        name: "Geschenke",
        icon: <Gift className={"size-14"} />,
        color: "#FF6347",
    },
    {
        name: "Gesundheit",
        icon: <Heart className={"size-14"} />,
        color: "#32CD32",
    },
    {
        name: "Wohnung",
        icon: <Sofa className={"size-14"} />,
        color: "#9370DB",
    },
    {
        name: "Kleidung",
        icon: <Shirt className={"size-14"} />,
        color: "#00FA9A",
    },
    {
        name: "Freizeit",
        icon: <Joystick className={"size-14"} />,
        color: "#800080",
    },
    {
        name: "Urlaub",
        icon: <Plane className={"size-14"} />,
        color: "#87CEEB",
    },
];

export default function NewExpense() {
    const router = useRouter();
    const [selected, setSelected] = useState<string>();

    const amountRef = useRef<HTMLInputElement>(null);

    const [expense, setExpense] = useState("");
    const [amount, setAmount] = useState<string | undefined>("");

    const handleOnValueChange: CurrencyInputProps["onValueChange"] = (
        value: string | undefined,
    ) => {
        setAmount(value);
    };

    const [date, setDate] = useState<Date>(new Date());

    const onSubmit = useCallback(() => {
        alert(`${amount} ${expense} ${selected} ${format(date, "dd.MM.yyyy")}`);

        router.push("/");
    }, [amount, date, expense, router, selected]);

    return (
        <Popover>
            <div
                className={
                    "bg-surface flex h-[48px] w-dvw items-center gap-x-4 px-4 py-2"
                }
            >
                <button
                    onClick={() => {
                        router.back();
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
                                if (amount?.trim() === "") {
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
                            {category.icon}
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
                            value={amount}
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
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();

                                    onSubmit();
                                }
                            }}
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
