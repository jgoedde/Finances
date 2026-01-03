import { createFileRoute } from "@tanstack/react-router";
import { SearchBar } from "@/components/transactions/SearchBar.tsx";
import { LazyRow } from "@/components/transactions/LazyRow.tsx";
import { MonthlyOverview } from "@/components/transactions/MonthlyOverview.tsx";
import { TransactionList } from "@/components/transactions/TransactionList.tsx";
import { NewTransactionFAB } from "@/components/transactions/new-transaction-fab.tsx";
import { Insights } from "@/components/transactions/Insights.tsx";
import { useBackupCheck } from "@/hooks/use-backup-config.ts";
import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/sonner.tsx";

export const Route = createFileRoute("/")({
    component: TransactionsPage,
});

function TransactionsPage() {
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
                <TransactionList />
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

            <NewTransactionFAB />
            <Toaster />
        </div>
    );
}
