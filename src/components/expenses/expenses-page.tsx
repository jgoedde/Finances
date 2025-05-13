import {
    Calendar1,
    Download,
    Drama,
    Menu,
    Scroll,
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

export const ExpensesPage = () => {
    const dispatch = useAppDispatch();

    const { key } = useEncryption();

    const isDecrypting = useAppSelector((state) => state.expenses.isDecrypting);
    const expenses = useAppSelector(expensesSelectors.selectAll);

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
        <div className={"relative container mx-auto"}>
            <div
                className={
                    "bg-surface-container-high text-on-surface-variant mx-auto mt-1 flex h-[50px] w-7/8 content-center items-center gap-x-3 rounded-full px-2"
                }
            >
                <div className={"pl-3"}>
                    <Menu className={"text-on-surface"} />
                </div>
                <div className={""}>Search for expense</div>
            </div>

            <div className={"mt-6 flex w-full gap-x-3 overflow-x-auto px-2"}>
                <Card className={"w-[150px] shrink-0 border-none shadow-none"}>
                    <CardHeader className={"flex flex-col font-semibold"}>
                        <div className={"text-tertiary"}>
                            <Sunrise />
                        </div>
                        <div>{"Today's"} Transactions</div>
                    </CardHeader>
                    <CardContent className={"mt-auto"}>
                        <div className={"text-tertiary"}>
                            {formatEuro(stats.today)}
                        </div>
                    </CardContent>
                </Card>
                <Card className={"w-[150px] shrink-0 border-none shadow-none"}>
                    <CardHeader className={"flex flex-col font-semibold"}>
                        <div className={"text-tertiary"}>
                            <Calendar1 />
                        </div>
                        <div>Spent yesterday</div>
                    </CardHeader>
                    <CardContent className={"mt-auto"}>
                        <div className={"text-tertiary"}>
                            {formatEuro(stats.yesterday)}
                        </div>
                    </CardContent>
                </Card>
                <Card className={"w-[150px] shrink-0 border-none shadow-none"}>
                    <CardHeader className={"flex flex-col font-semibold"}>
                        <div className={"text-tertiary"}>
                            <Scroll />
                        </div>
                        <div>This month</div>
                    </CardHeader>
                    <CardContent className={"mt-auto"}>
                        <div className={"text-tertiary"}>
                            {formatEuro(stats.month)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <main className={"my-6"}>
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

                {expenses.length === 0 && !isDecrypting && (
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

            <NewExpenseFAB />
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
