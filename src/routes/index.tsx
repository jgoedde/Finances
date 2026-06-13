import { createFileRoute } from "@tanstack/react-router";
import { SearchBar } from "@/features/transactions/components/search-bar.tsx";
import { LazyRow } from "@/features/transactions/components/lazy-row.tsx";
import { MonthlyOverview } from "@/features/transactions/components/charts/monthly-overview.tsx";
import { TransactionList } from "@/features/transactions/components/list/transaction-list.tsx";
import { NewTransactionFAB } from "@/features/transactions/components/new-transaction-fab.tsx";
import { Insights } from "@/features/transactions/components/insights.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { FixedCostsTable } from "@/features/fixed-costs/fixed-costs-table.tsx";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className={"relative container mx-auto flex h-dvh flex-col"}>
            <SearchBar />
            <LazyRow />
            <main className={"grow"}>
                <div className={"my-4 px-4"}></div>
                <MonthlyOverview />
                <Insights />
                <TransactionList />
                <FixedCostsTable />
            </main>

            <footer>
                <div
                    className={`bg-surface-container-lowest text-surface-variant
                        flex flex-col items-center px-4 py-2`}
                >
                    <span>
                        Ausgabentracker{" "}
                        <a href="https://github.com/jgoedde/Finances/releases">
                            v{__APP_VERSION__}
                        </a>
                    </span>
                    <span>{import.meta.env.MODE}</span>
                </div>
            </footer>

            <NewTransactionFAB />
            <Toaster />
        </div>
    );
}
