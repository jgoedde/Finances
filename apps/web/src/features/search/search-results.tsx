import { useState } from "react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import ChevronDown from "~icons/material-symbols/keyboard-arrow-down-rounded";
import {
    type DateFilterOption,
    getDateFilterStr,
} from "#/features/search/filters/date/date-filter.ts";
import { Drawer, DrawerContent } from "#/components/ui/drawer.tsx";
import { DateFilterDrawerContent } from "#/features/search/filters/date/date-filter-drawer-content.tsx";
import { FilterChip } from "#/components/ui/chip.tsx";
import { Button } from "#/components/ui/button.tsx";
import { groupByDay } from "#/features/transactions/utils/transaction-utils.ts";
import { TransactionGroup } from "#/features/transactions/components/list/transaction-group.tsx";
import { useTransactionSearch } from "#/features/search/search-queries.ts";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { OfflineEmpty } from "#/components/offline-empty.tsx";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "#/components/ui/empty.tsx";
import SearchOffIcon from "~icons/material-symbols/search-off-rounded";
import { m } from "#/paraglide/messages.js";

const transactionsRoute = getRouteApi("/_authed/_shell/_transactions");

/**
 * Results for `?q=` across all months, newest first, grouped by day. A
 * result's menu opens it in its month's list.
 */
export function SearchResults() {
    const { q = "", older: dateFilterOption = "any" } =
        transactionsRoute.useSearch();
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isOnline = useIsOnline();

    const {
        data,
        isSuccess,
        isPlaceholderData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useTransactionSearch({ q: q.trim(), older: dateFilterOption });
    const transactions = data?.pages.flatMap((page) => page.items) ?? [];
    const mainExpenses = data?.pages.flatMap((page) => page.mainExpenses) ?? [];
    // Also a later page's result: the day may continue there.
    const findMainExpense = (id: string) =>
        [...transactions, ...mainExpenses].find((it) => it.id === id);
    // Across pages, so a day grows when the next page continues it.
    const days = groupByDay(transactions);

    function setDateFilterOption(option: DateFilterOption) {
        void navigate({
            to: "/transactions",
            search: {
                older: option === "any" ? undefined : option,
            },
            replace: true,
        });
    }

    return (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerContent>
                <DateFilterDrawerContent
                    closeDrawer={() => setIsDrawerOpen(false)}
                    dateFilterOption={dateFilterOption}
                    setDateFilterOption={setDateFilterOption}
                />
            </DrawerContent>
            <div className={"flex flex-wrap items-center gap-2 px-4 py-1"}>
                <span
                    className={"grow text-title-small text-on-surface-variant"}
                >
                    {m.search_all_months()}
                </span>
                {/* Opens the period drawer, whether a period is set or not. */}
                <FilterChip
                    selected={dateFilterOption !== "any"}
                    trailingIcon={ChevronDown}
                    onSelect={() => setIsDrawerOpen(true)}
                    onDeselect={() => setIsDrawerOpen(true)}
                >
                    {dateFilterOption === "any"
                        ? m.period()
                        : getDateFilterStr(dateFilterOption)}
                </FilterChip>
            </div>
            {!isOnline && !data && (
                <OfflineEmpty description={m.search_offline()} />
            )}
            {isSuccess && !isPlaceholderData && transactions.length === 0 && (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia>
                            <SearchOffIcon />
                        </EmptyMedia>
                        <EmptyTitle>{m.search_no_results()}</EmptyTitle>
                        <EmptyDescription>
                            {m.search_no_results_hint()}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}
            <div className={"flex flex-col pt-2"}>
                {days.map(([day, dayTransactions]) => (
                    <TransactionGroup
                        key={day.getTime()}
                        day={day}
                        transactions={dayTransactions}
                        findMainExpense={findMainExpense}
                    />
                ))}
            </div>
            {hasNextPage && (
                <div className={"my-4 flex justify-center"}>
                    <OfflineHint active={!isOnline}>
                        <Button
                            variant={"outline"}
                            disabled={!isOnline || isFetchingNextPage}
                            onClick={() => void fetchNextPage()}
                        >
                            {m.search_load_more()}
                        </Button>
                    </OfflineHint>
                </div>
            )}
        </Drawer>
    );
}
