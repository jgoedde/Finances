import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    getDateFilterStr,
    isMatchingDateFilter,
} from "#/features/search/filters/date/date-filter.ts";
import { isMatchingSearchFilter } from "#/features/search/filters/text/text-filter.ts";
import { Drawer, DrawerContent } from "#/components/ui/drawer.tsx";
import { DateFilterDrawerContent } from "#/features/search/filters/date/date-filter-drawer-content.tsx";
import { ChevronDown, X } from "lucide-react";
import { Badge } from "#/components/ui/badge.tsx";
import { useTransactions } from "#/features/transactions/transaction-queries.ts";
import { addYears, endOfYear } from "date-fns";
import { TransactionListItem } from "#/features/transactions/components/list/transaction-list-item.tsx";
import { BackArrowButton } from "#/components/ui/back-arrow-button.tsx";
import { cn } from "#/lib/cn.ts";
import { Button } from "#/components/ui/button.tsx";

export const Route = createFileRoute("/_authed/transactions/search")({
    component: RouteComponent,
});

const now = new Date();

function RouteComponent() {
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState<{
        type?: "date";
        isOpen: boolean;
    }>({ isOpen: false });

    const query = useMemo(
        () => ({ start: addYears(now, -10), end: endOfYear(now) }),
        [],
    );

    const transactions = useTransactions(query);

    useEffect(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    const [dateFilterOption, setDateFilterOption] = useState<
        "any" | "oneWeek" | "oneMonth" | "halfYear" | "oneYear"
    >("any");

    const filteredTransactions = useMemo(() => {
        if (search.trim() === "") {
            return transactions.filter((e) =>
                isMatchingDateFilter(e, dateFilterOption),
            );
        }

        const searchLower = search.toLowerCase();
        return transactions
            .filter((e) => isMatchingDateFilter(e, dateFilterOption))
            .filter((e) => isMatchingSearchFilter(e, searchLower));
    }, [dateFilterOption, transactions, search]);

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
                        aria-label={"Suche"}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`min-w-0 grow bg-transparent text-body-large
                            text-on-surface caret-primary outline-none
                            placeholder:text-on-surface-variant
                            [&::-webkit-search-cancel-button]:hidden`}
                        placeholder={"Buchung/Transaktion suchen"}
                    />
                    {search !== "" && (
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            aria-label={"Suche leeren"}
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
                                ? "Zeitraum"
                                : getDateFilterStr(dateFilterOption)}
                            <ChevronDown />
                        </button>
                    </Badge>
                </div>
                {filteredTransactions.length === 0 && search !== "" && (
                    <div className={"my-auto text-center"}>
                        <h3
                            className={
                                "text-title-large text-on-surface-variant"
                            }
                        >
                            Keine Ergebnisse
                        </h3>
                    </div>
                )}
                <div className={"mx-auto flex w-full max-w-3xl flex-col px-2"}>
                    {filteredTransactions.length > 0 &&
                        filteredTransactions.map((it) => (
                            <TransactionListItem key={it.id} transaction={it} />
                        ))}
                </div>
            </Drawer>
        </div>
    );
}
