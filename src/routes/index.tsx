import { createFileRoute } from "@tanstack/react-router";
import { SearchBar } from "@/components/expenses/SearchBar.tsx";
import { LazyRow } from "@/components/expenses/LazyRow.tsx";
import { MonthlyOverview } from "@/components/expenses/MonthlyOverview.tsx";
import { ExpensesList } from "@/components/expenses/ExpensesList.tsx";
import { NewExpenseFAB } from "@/components/expenses/new-expense-fab.tsx";
import { useExpensesCount } from "@/components/expenses/use-expenses";
import { ExportButton } from "@/components/expenses/export-button.tsx";

export const Route = createFileRoute("/")({
    component: ExpensesPage,
});

function ExpensesPage() {
    const expensesCount = useExpensesCount();

    function getHeadlineText() {
        return "HALLO, MARCELL DAVIS!";
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
                        <ExportButton />
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
                {/*<Insights />*/}
                <ExpensesList />
            </main>

            <NewExpenseFAB />
        </div>
    );
}
