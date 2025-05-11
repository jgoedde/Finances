import { Calendar1, Menu, Scroll, Sunrise } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { ExpensesGroup } from "@/components/expenses/history/expenses-group.tsx";
import { NewExpenseFAB } from "@/components/expenses/new-expense-fab.tsx";
import { type Expense, useExpenses } from "@/components/use-expenses.ts";
import { useMemo } from "react";

export const ExpensesPage = () => {
    const { expenses } = useExpenses();

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

    return (
        <div className={"relative container mx-auto h-dvh"}>
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
                        <div className={"text-tertiary"}>17,12€</div>
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
                        <div className={"text-tertiary"}>17,12€</div>
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
                        <div className={"text-tertiary"}>17,12€</div>
                    </CardContent>
                </Card>
            </div>

            <main className={"my-6 px-4"}>
                <h1
                    className={
                        "text-primary font-poppins mb-2 text-2xl font-bold"
                    }
                >
                    My expenses
                </h1>
                <div className={"flex flex-col gap-y-4"}>
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
