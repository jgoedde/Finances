import { createFileRoute } from "@tanstack/react-router";
import { SearchBar } from "@/components/expenses/SearchBar.tsx";
import { LazyRow } from "@/components/expenses/LazyRow.tsx";
import { MonthlyOverview } from "@/components/expenses/MonthlyOverview.tsx";
import { ExpensesList } from "@/components/expenses/ExpensesList.tsx";
import { NewExpenseFAB } from "@/components/expenses/new-expense-fab.tsx";
import { Insights } from "@/components/expenses/Insights.tsx";
import { useBackupCheck } from "@/hooks/use-backup-config.ts";
import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/sonner.tsx";

export const Route = createFileRoute("/")({
    component: ExpensesPage,
});

function ExpensesPage() {
    const checkBackup = useBackupCheck();

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        checkBackup();
    }, [checkBackup]);

    return (
        <div className={"relative container mx-auto flex h-dvh flex-col"}>
            <SearchBar />
            <LazyRow />
            <main className={"grow"}>
                <div className={"my-4 px-4"}></div>
                <MonthlyOverview />
                <Insights />
                <ExpensesList />
            </main>

            <footer>
                <div
                    className={
                        "bg-surface-container-lowest text-surface-variant flex flex-col items-center px-4 py-2"
                    }
                >
                    <span>Ausgabentracker v{__APP_VERSION__}</span>
                    <span>{__APP_ENV__}</span>
                    <span>{__APP_COMMIT_HASH__}</span>
                </div>
            </footer>

            <NewExpenseFAB />
            <Toaster />
        </div>
    );
}
