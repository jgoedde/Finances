import { createFileRoute } from "@tanstack/react-router";
import { SearchBar } from "@/features/transactions/components/search-bar.tsx";
import { LazyRow } from "@/features/transactions/components/lazy-row.tsx";
import { MonthlyOverview } from "@/features/transactions/components/charts/monthly-overview.tsx";
import { TransactionList } from "@/features/transactions/components/list/transaction-list.tsx";
import { NewTransactionFAB } from "@/features/transactions/components/new-transaction-fab.tsx";
import { Insights } from "@/features/transactions/components/insights.tsx";
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
                <div
                    className={`lg:grid lg:grid-cols-2 lg:items-start
                        lg:gap-x-2`}
                >
                    <div className={"min-w-0"}>
                        <MonthlyOverview />
                    </div>
                    <div className={"min-w-0 lg:col-span-2 lg:row-start-2"}>
                        <Insights />
                    </div>
                    <div className={"min-w-0 lg:col-start-2 lg:row-start-1"}>
                        <TransactionList />
                    </div>
                    <div className={"min-w-0 lg:col-span-2"}>
                        <FixedCostsTable />
                    </div>
                </div>
            </main>

            <footer>
                <div
                    className={`text-on-surface-variant text-body-small flex
                        flex-col items-center px-4 py-4`}
                >
                    <span>
                        Ausgabentracker{" "}
                        <a
                            className={`text-primary underline-offset-4
                                hover:underline`}
                            href="https://github.com/jgoedde/Finances/releases"
                        >
                            v{__APP_VERSION__}
                        </a>
                    </span>
                    <span>{import.meta.env.MODE}</span>
                </div>
            </footer>

            <NewTransactionFAB />
        </div>
    );
}
