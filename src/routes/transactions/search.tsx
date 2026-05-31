import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    getDateFilterStr,
    isMatchingDateFilter,
} from "@/components/search/filters/date/date-filter.ts";
import { isMatchingSearchFilter } from "@/components/search/filters/text/text-filter.ts";
import { cn } from "@/lib/utils.ts";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { DateFilterDrawerContent } from "@/components/search/filters/date/date-filter-drawer-content";
import { ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/components/transactions/use-transactions.ts";
import { addYears, endOfYear } from "date-fns";
import { TransactionListItem } from "@/components/transactions/history/transaction-list-item.tsx";
import { BackArrowButton } from "@/components/ui/back-arrow-button.tsx";

export const Route = createFileRoute("/transactions/search")({
    component: SearchPage,
});

const now = new Date();

function SearchPage() {
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
            className={
                "bg-surface-container-high relative container mx-auto flex h-dvh flex-col overflow-y-scroll"
            }
        >
            <Drawer
                open={isDrawerOpen.isOpen}
                onOpenChange={(e) =>
                    setIsDrawerOpen((prev) => ({ ...prev, isOpen: e }))
                }
            >
                <DrawerContent className={"text-on-surface"}>
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
                    className={
                        "border-outline bg-surface-container-high flex h-16 w-dvw shrink-0 items-center border-b py-2"
                    }
                >
                    <BackArrowButton />
                    <input
                        ref={inputRef}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={"border-none text-lg outline-none"}
                        placeholder={"Buchung/Transaktion suchen"}
                    />
                    <button
                        type={"button"}
                        onClick={() => {
                            setSearch("");
                            inputRef.current?.focus();
                        }}
                        className={
                            "text-on-surface-variant ml-auto cursor-pointer px-4"
                        }
                    >
                        <X className={"size-6"} />
                    </button>
                </div>
                <div
                    className={
                        "my-2 flex h-8 shrink-0 gap-x-2 overflow-x-scroll"
                    }
                >
                    <Badge
                        variant={"md3"}
                        className={cn(
                            "ml-2 flex gap-x-1",
                            dateFilterOption !== "any" &&
                                "bg-secondary-container text-on-secondary-container outline-outline",
                        )}
                        onClick={() => {
                            setIsDrawerOpen({ type: "date", isOpen: true });
                        }}
                    >
                        <div className={"text-on-surface font-medium"}>
                            {dateFilterOption === "any"
                                ? "Zeitraum"
                                : getDateFilterStr(dateFilterOption)}
                        </div>
                        <div>
                            <ChevronDown className={"size-4"} strokeWidth={2} />
                        </div>
                    </Badge>
                </div>
                {filteredTransactions.length === 0 && search !== "" && (
                    <div className={"my-auto text-center"}>
                        <h3 className={"text-outline text-xl"}>
                            Keine Ergebnisse
                        </h3>
                    </div>
                )}
                <div className={"flex w-full flex-col px-4"}>
                    {filteredTransactions.length > 0 &&
                        filteredTransactions.map((it) => (
                            <TransactionListItem key={it.id} transaction={it} />
                        ))}
                </div>
            </Drawer>
        </div>
    );
}
