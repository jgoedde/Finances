import { getRouteApi } from "@tanstack/react-router";
import { SearchBar } from "#/features/search/search-bar.tsx";
import { SearchResults } from "#/features/search/search-results.tsx";
import { MonthSwitcher } from "#/features/month/month-switcher.tsx";
import { CategoryFilterMenu } from "#/features/transactions/components/list/category-filter-menu.tsx";
import { TransactionList } from "#/features/transactions/components/list/transaction-list.tsx";
import { NewTransactionFAB } from "#/features/transactions/components/new-transaction-fab.tsx";

const transactionsRoute = getRouteApi("/_authed/_shell/_transactions");

/**
 * The Transactions destination: search bar on top, then either the
 * selected month's list (with the category filter beside the month) or
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
                        <div
                            className={
                                "mb-2 flex items-center justify-between px-1"
                            }
                        >
                            <MonthSwitcher to={"/transactions"} />
                            <CategoryFilterMenu />
                        </div>
                        <TransactionList />
                    </>
                )}
            </main>
            <NewTransactionFAB variant={"floating"} />
        </div>
    );
}
