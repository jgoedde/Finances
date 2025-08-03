import { NewExpenseFAB } from "@/components/expenses/new-expense-fab.tsx";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-hooks.ts";
import { selectAllExpenses } from "@/components/expenses/slice.ts";
import { useEncryption } from "@/components/use-encryption.ts";
import { loadExpenses } from "@/components/expenses/actions.ts";
import { maybeMigrateLocalStorage } from "@/lib/app-local-storage.ts";
import { loadFixedCosts } from "@/components/fixed-costs/actions.ts";
import { MonthlyOverview } from "./MonthlyOverview";
import { LazyRow } from "@/components/expenses/LazyRow.tsx";
import { SearchBar } from "@/components/expenses/SearchBar.tsx";
import { ExportButton } from "@/components/expenses/export-button.tsx";
import { ExpensesList } from "@/components/expenses/ExpensesList.tsx";
import { Insights } from "@/components/expenses/Insights.tsx";

export const ExpensesPage = () => {
    const dispatch = useAppDispatch();

    const { key } = useEncryption();

    const isDecrypting = useAppSelector((state) => state.app.isDecrypting);
    const isInitial = useAppSelector((state) => state.expenses.isInitial);
    const expenses = useAppSelector(selectAllExpenses);

    useEffect(() => {
        if (!key || expenses.length > 0) {
            return;
        }

        (async () => {
            await maybeMigrateLocalStorage({ key });
            dispatch(loadExpenses({ key }));
            dispatch(loadFixedCosts({ key }));
        })();
    }, [dispatch, expenses.length, key]);

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
                        {expenses.length > 0 && <ExportButton />}
                    </div>
                    <div className={"mt-2"}>
                        Du hast bislang {expenses.length} Ausgaben getrackt. Je
                        mehr du trackst, desto besser kannst du deine Ausgaben
                        im Blick behalten.
                    </div>
                </div>
                <MonthlyOverview />
                <Insights />
                <ExpensesList />
            </main>

            {!isDecrypting && !isInitial && <NewExpenseFAB />}
        </div>
    );
};
