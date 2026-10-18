import { getRouteApi } from "@tanstack/react-router";
import { SearchBar } from "#/features/search/search-bar.tsx";
import { SearchResults } from "#/features/search/search-results.tsx";
import { MonthSwitcher } from "#/features/month/month-switcher.tsx";
import { CategoryChips } from "#/features/transactions/components/list/category-chips.tsx";
import { TransactionList } from "#/features/transactions/components/list/transaction-list.tsx";
import { NewTransactionFAB } from "#/features/transactions/components/new-transaction-fab.tsx";

const transactionsRoute = getRouteApi("/_authed/_shell/_transactions");

/**
 * The Transactions destination: search bar on top, then either the
 * selected month's list (with category chips below expanded windows) or
 * search results across all months.
 */
export function TransactionsView() {
    const { q } = transactionsRoute.useSearch();
    const isSearching = Boolean(q?.trim());

    return (
        <div className={"mx-auto flex min-h-dvh w-full max-w-3xl flex-col"}>
            <div className={"sticky top-0 z-10 bg-surface px-4 py-2"}>
                <SearchBar />
            </div>
            <main className={"flex flex-col"}>
                {isSearching ? (
                    <SearchResults />
                ) : (
                    <>
                        <div className={"px-1"}>
                            <MonthSwitcher to={"/transactions"} />
                        </div>
                        <CategoryChips className={"pb-2 expanded:hidden"} />
                        <TransactionList />
                    </>
                )}
            </main>
            <NewTransactionFAB variant={"floating"} />
        </div>
    );
}
