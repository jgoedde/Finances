import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
    DATE_FILTER_OPTIONS,
    type DateFilterOption,
    getDateFilterStr,
} from "#/features/search/filters/date/date-filter.ts";
import { Drawer, DrawerContent } from "#/components/ui/drawer.tsx";
import { DateFilterDrawerContent } from "#/features/search/filters/date/date-filter-drawer-content.tsx";
import { ChevronDown, X } from "lucide-react";
import { Badge } from "#/components/ui/badge.tsx";
import { TransactionListItem } from "#/features/transactions/components/list/transaction-list-item.tsx";
import { BackArrowButton } from "#/components/ui/back-arrow-button.tsx";
import { cn } from "#/lib/cn.ts";
import { Button } from "#/components/ui/button.tsx";
import { useTransactionSearch } from "#/features/search/search-queries.ts";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { m } from "#/paraglide/messages.js";

const searchSchema = z.object({
    q: z.string().optional().catch(undefined),
    older: z.enum(DATE_FILTER_OPTIONS).optional().catch(undefined),
});

export const Route = createFileRoute("/_authed/transactions/search")({
    component: RouteComponent,
    validateSearch: searchSchema,
});

/** Delay before a typed term goes to the URL and runs the search. */
const SEARCH_DEBOUNCE_MS = 300;

function RouteComponent() {
    const { q = "", older: dateFilterOption = "any" } = Route.useSearch();
    const navigate = Route.useNavigate();
    const [search, setSearch] = useState(q);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState<{
        type?: "date";
        isOpen: boolean;
    }>({ isOpen: false });
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

    useEffect(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    useEffect(() => {
        if (search === q) {
            return;
        }
        const timeout = setTimeout(() => {
            void navigate({
                search: (prev) => ({ ...prev, q: search || undefined }),
                replace: true,
            });
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timeout);
    }, [search, q, navigate]);

    function setDateFilterOption(option: DateFilterOption) {
        void navigate({
            search: (prev) => ({
                ...prev,
                older: option === "any" ? undefined : option,
            }),
            replace: true,
        });
    }

    return (
        <div
            className={`relative container mx-auto flex h-dvh flex-col
                overflow-y-scroll bg-surface-container-high`}
        >
            <Drawer
                open={isDrawerOpen.isOpen}
                onOpenChange={(e) =>
                    setIsDrawerOpen((prev) => ({ ...prev, isOpen: e }))
                }
            >
                <DrawerContent>
                    {isDrawerOpen.type === "date" && (
                        <DateFilterDrawerContent
                            closeDrawer={() =>
                                setIsDrawerOpen((prev) => ({
                                    ...prev,
                                    isOpen: false,
                                }))
                            }
                            dateFilterOption={dateFilterOption}
                            setDateFilterOption={setDateFilterOption}
                        />
                    )}
                </DrawerContent>
                <div
                    className={`sticky top-0 z-10 flex h-[72px] w-full shrink-0
                        items-center gap-1 border-b border-outline
                        bg-surface-container-high pr-1`}
                >
                    <BackArrowButton />
                    <input
                        ref={inputRef}
                        type={"search"}
                        aria-label={m.search_label()}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`min-w-0 grow bg-transparent text-body-large
                            text-on-surface caret-primary outline-none
                            placeholder:text-on-surface-variant
                            [&::-webkit-search-cancel-button]:hidden`}
                        placeholder={m.search_placeholder()}
                    />
                    {search !== "" && (
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            aria-label={m.search_clear()}
                            onClick={() => {
                                setSearch("");
                                inputRef.current?.focus();
                            }}
                        >
                            <X />
                        </Button>
                    )}
                </div>
                <div
                    className={`mx-auto my-2 flex w-full max-w-3xl shrink-0
                        gap-x-2 overflow-x-auto px-4 py-1`}
                >
                    <Badge
                        asChild
                        variant={"md3"}
                        className={cn(
                            dateFilterOption !== "any" &&
                                `border-transparent bg-secondary-container
                                text-on-secondary-container`,
                        )}
                        onClick={() => {
                            setIsDrawerOpen({ type: "date", isOpen: true });
                        }}
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
                        className={`my-auto text-center text-body-large
                        text-on-surface-variant`}
                    >
                        {m.search_offline()}
                    </p>
                )}
                {isSuccess &&
                    !isPlaceholderData &&
                    transactions.length === 0 && (
                        <div className={"my-auto text-center"}>
                            <h3
                                className={
                                    "text-title-large text-on-surface-variant"
                                }
                            >
                                {m.search_no_results()}
                            </h3>
                        </div>
                    )}
                <div className={"mx-auto flex w-full max-w-3xl flex-col px-2"}>
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
        </div>
    );
}
