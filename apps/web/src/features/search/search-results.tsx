import { useState } from "react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import CalendarArrowRight from "~icons/material-symbols/calendar-month-outline-rounded";
import ChevronDown from "~icons/material-symbols/keyboard-arrow-down-rounded";
import {
    type DateFilterOption,
    getDateFilterStr,
} from "#/features/search/filters/date/date-filter.ts";
import { Drawer, DrawerContent } from "#/components/ui/drawer.tsx";
import { DateFilterDrawerContent } from "#/features/search/filters/date/date-filter-drawer-content.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { groupByDay } from "#/features/transactions/utils/transaction-utils.ts";
import { TransactionGroup } from "#/features/transactions/components/list/transaction-group.tsx";
import { useShowInMonth } from "#/features/transactions/components/list/month-landing.ts";
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
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

const transactionsRoute = getRouteApi("/_authed/_shell/_transactions");

/**
 * Results for `?q=` across all months, newest first, grouped by day. Each
 * day opens in its month's list.
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
    const showInMonth = useShowInMonth();

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
                <Badge
                    asChild
                    variant={"md3"}
                    className={cn(
                        dateFilterOption !== "any" &&
                            `border-transparent bg-secondary-container
                            text-on-secondary-container`,
                    )}
                    onClick={() => setIsDrawerOpen(true)}
                >
                    <button type={"button"}>
                        {dateFilterOption === "any"
                            ? m.period()
                            : getDateFilterStr(dateFilterOption)}
                        <ChevronDown />
                    </button>
                </Badge>
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
                        action={
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                aria-label={m.search_show_in_month()}
                                title={m.search_show_in_month()}
                                onClick={() =>
                                    showInMonth(
                                        day,
                                        dayTransactions.map((it) => it.id),
                                    )
                                }
                            >
                                <CalendarArrowRight />
                            </Button>
                        }
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
