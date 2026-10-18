import { useState } from "react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import {
    type DateFilterOption,
    getDateFilterStr,
} from "#/features/search/filters/date/date-filter.ts";
import { Drawer, DrawerContent } from "#/components/ui/drawer.tsx";
import { DateFilterDrawerContent } from "#/features/search/filters/date/date-filter-drawer-content.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { TransactionListItem } from "#/features/transactions/components/list/transaction-list-item.tsx";
import { useTransactionSearch } from "#/features/search/search-queries.ts";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

const transactionsRoute = getRouteApi("/_authed/_shell/_transactions");

/** Results for `?q=` across all months, newest first. */
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
                <p
                    className={`my-8 text-center text-body-large
                    text-on-surface-variant`}
                >
                    {m.search_offline()}
                </p>
            )}
            {isSuccess && !isPlaceholderData && transactions.length === 0 && (
                <p
                    className={`my-8 text-center text-title-large
                    text-on-surface-variant`}
                >
                    {m.search_no_results()}
                </p>
            )}
            <div className={"flex flex-col gap-y-1.5 px-2 pt-2"}>
                {transactions.map((it) => (
                    <TransactionListItem key={it.id} transaction={it} />
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
