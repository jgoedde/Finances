import {
    Calendar1,
    Download,
    Drama,
    Scroll,
    Search,
    Sunrise,
    Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { ExpensesGroup } from "@/components/expenses/history/expenses-group.tsx";
import { NewExpenseFAB } from "@/components/expenses/new-expense-fab.tsx";
import { type Expense } from "@/components/use-expenses.ts";
import { useEffect, useMemo } from "react";
import { isSameMonth, isToday, isYesterday } from "date-fns";
import { formatEuro } from "@/lib/currency-utils.ts";
import { useFileDialog } from "@mantine/hooks";
import { useAppDispatch, useAppSelector } from "@/hooks.ts";
import { expensesSelectors } from "@/components/expenses/slice.ts";
import { loadExpenses } from "@/components/expenses/actions.ts";
import { useEncryption } from "@/components/use-encryption.ts";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";
import { useLocation } from "wouter";
import { useRipple } from "@/hooks/use-ripple.ts";

export const ExpensesPage = () => {
    const dispatch = useAppDispatch();

    const { key } = useEncryption();
    const ripple = useRipple();

    const isDecrypting = useAppSelector((state) => state.expenses.isDecrypting);
    const isInitial = useAppSelector((state) => state.expenses.isInitial);
    const expenses = useAppSelector(expensesSelectors.selectAll);
    const [, route] = useLocation();

    useEffect(() => {
        if (!key || expenses.length > 0) {
            return;
        }

        void dispatch(loadExpenses({ key }));
    }, [dispatch, expenses.length, key]);

    const groupedExpenses = useMemo(
        () =>
            expenses.reduce((acc: { [key: string]: Expense[] }, expense) => {
                const date = new Date(expense.date).toLocaleDateString(
                    "de-DE",
                    {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                    },
                );
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(expense);
                return acc;
            }, {}),
        [expenses],
    );

    const stats = useExpensesStats(expenses);

    const { open, files } = useFileDialog({ accept: ".txt", multiple: false });

    useEffect(() => {
        const file = files?.[0];

        if (!file) {
            return;
        }

        async function readTxt() {
            if (!key) {
                throw new Error("No encryption key found");
            }
            localStorage.setItem("expenses", await file!.text());
            void dispatch(loadExpenses({ key }));
        }

        void readTxt();
    }, [dispatch, files, key]);

    return (
        <div className={"relative container mx-auto flex h-dvh flex-col"}>
            <div
                className={
                    "bg-surface-container-high mx-auto mt-3 flex h-14 w-7/8 shrink-0 content-center items-center rounded-full"
                }
            >
                <div className={"px-4"}>
                    <Search className={"text-on-surface size-6"} />
                </div>
                <div className={"text-on-surface-variant"}>
                    Search for expense
                </div>
            </div>

            <div
                className={
                    "mt-6 flex w-full shrink-0 gap-x-3 overflow-x-auto px-3"
                }
            >
                <Card
                    className={
                        "ripple-container bg-primary-container text-on-primary-container font-poppins w-[150px] shrink-0 border-none shadow-none"
                    }
                    data-ripple-color="bg-on-surface/10"
                    {...ripple}
                >
                    <CardHeader className={"flex flex-col font-medium"}>
                        <div className={""}>
                            <Sunrise />
                        </div>
                        <div className={""}>Spent today</div>
                    </CardHeader>
                    <CardContent className={"mt-auto"}>
                        <div className={"font-bold"}>
                            {formatEuro(stats.today)}
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={
                        "ripple-container bg-tertiary-container text-on-tertiary-container font-poppins w-[150px] shrink-0 border-none shadow-none"
                    }
                    data-ripple-color="bg-on-surface/10"
                    {...ripple}
                    onClick={(e) => {
                        ripple.onClick(e);
                        route("/reporting");
                    }}
                >
                    <CardHeader className={"flex flex-col font-medium"}>
                        <div className={""}>
                            <Scroll />
                        </div>
                        <div>Spent this month</div>
                    </CardHeader>
                    <CardContent className={"mt-auto"}>
                        <div className={"font-bold"}>
                            {formatEuro(stats.month)}
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={
                        "ripple-container font-poppins w-[150px] shrink-0 border-none shadow-none"
                    }
                    data-ripple-color="bg-on-surface/10"
                    {...ripple}
                >
                    <CardHeader className={"flex flex-col"}>
                        <div className={"text-on-surface"}>
                            <Calendar1 />
                        </div>
                        <div className={"font-medium"}>Spent yesterday</div>
                    </CardHeader>
                    <CardContent className={"mt-auto"}>
                        <div className={"font-bold"}>
                            {formatEuro(stats.yesterday)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <main className={"my-6 grow"}>
                <div className={"flex items-center justify-between px-4"}>
                    <h1
                        className={
                            "text-primary font-poppins mb-4 text-2xl font-bold"
                        }
                    >
                        My expenses
                    </h1>
                    {Object.keys(groupedExpenses).length > 0 && (
                        <button
                            onClick={() => {
                                const blob = new Blob(
                                    [localStorage.getItem("expenses") ?? ""],
                                    {
                                        type: "application/text",
                                    },
                                );
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `${Date.now()}-expenses.txt`;
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                        >
                            <Download className={"text-secondary size-5"} />
                        </button>
                    )}
                </div>

                {expenses.length === 0 && !isDecrypting && !isInitial && (
                    <div
                        className={
                            "text-on-surface-variant my-6 flex w-full flex-col items-center px-4"
                        }
                    >
                        <Drama className={"size-24"} />
                        <div className={"mt-2"}>No expenses tracked yet</div>
                        <button
                            onClick={() => open()}
                            className={"text-primary mt-1 flex gap-x-2 text-sm"}
                        >
                            <Upload className={"size-4"} />
                            Import database
                        </button>
                    </div>
                )}

                {isDecrypting && (
                    <div
                        className={
                            "text-secondary my-5 flex w-full flex-col items-center px-4"
                        }
                    >
                        <div>Loading expenses...</div>
                        <LoadingSpinner />
                    </div>
                )}

                <div className={"flex w-full flex-col gap-y-4"}>
                    {Object.keys(groupedExpenses).map((date, i) => {
                        const expenses = groupedExpenses[date];
                        return (
                            <ExpensesGroup
                                key={`${date}-${i}`}
                                date={date}
                                expenses={expenses}
                            />
                        );
                    })}
                </div>
            </main>

            {!isDecrypting && !isInitial && <NewExpenseFAB />}
        </div>
    );
};

function useExpensesStats(expenses: Expense[]) {
    const amountsToday = expenses
        .filter((e) => isToday(e.date))
        .map((e) => e.amount);
    const sumToday = amountsToday.reduce((acc, amount) => acc + amount, 0);

    const amountsYesterday = expenses
        .filter((e) => isYesterday(e.date))
        .map((e) => e.amount);
    const sumYesterday = amountsYesterday.reduce(
        (acc, amount) => acc + amount,
        0,
    );

    const amountsThisMonth = expenses
        .filter((e) => isSameMonth(new Date(), e.date))
        .map((e) => e.amount);

    const sumThisMonth = amountsThisMonth.reduce(
        (acc, amount) => acc + amount,
        0,
    );

    return {
        today: sumToday,
        yesterday: sumYesterday,
        month: sumThisMonth,
    };
}
