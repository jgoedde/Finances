import { createFileRoute } from "@tanstack/react-router";
import { SearchBar } from "@/components/expenses/SearchBar.tsx";
import { LazyRow } from "@/components/expenses/LazyRow.tsx";
import { MonthlyOverview } from "@/components/expenses/MonthlyOverview.tsx";
import { Insights } from "@/components/expenses/Insights.tsx";
import { ExpensesList } from "@/components/expenses/ExpensesList.tsx";
import { NewExpenseFAB } from "@/components/expenses/new-expense-fab.tsx";
import { useCountExpenses } from "@/components/expenses/use-expenses";

export const Route = createFileRoute("/")({
    component: ExpensesPage,
});

function ExpensesPage() {
    const expensesCount = useCountExpenses();

    function getHeadlineText() {
        // 00:00 Uhr - 11:00 Uhr - Guten Morgen, Julian
        // 11:00 Uhr - 17:00 Uhr - Guten Tag, Julian
        // 17:00 Uhr - 23:59 Uhr - Guten Abend, Julian
        const now = new Date();
        const hours = now.getHours();
        let greeting = "Guten Tag";
        if (hours < 11) {
            greeting = "Guten Morgen";
        } else if (hours >= 17) {
            greeting = "Guten Abend";
        }
        return `${greeting}, Julian`;
    }

    const headlineText = getHeadlineText();

    return (
        <div className={"relative container mx-auto flex h-dvh flex-col"}>
            <SearchBar />

            <LazyRow />

            <main className={"grow"}>
                <div className={"my-4 px-4"}>
                    <div className={"flex items-center justify-between"}>
                        <h2
                            className={
                                "text-primary font-poppins text-2xl font-bold"
                            }
                        >
                            {headlineText}
                        </h2>
                    </div>
                    <div className={"mt-2"}>
                        <>
                            Du hast bislang {expensesCount} Ausgaben getrackt.
                            Je mehr du trackst, desto besser kannst du deine
                            Ausgaben im Blick behalten.
                        </>
                    </div>
                </div>
                <MonthlyOverview />
                <Insights />
                <ExpensesList />
            </main>

            <NewExpenseFAB />
        </div>
    );
}
