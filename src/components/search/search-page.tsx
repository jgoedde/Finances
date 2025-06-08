import { ArrowLeft, ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@/redux-hooks.ts";
import { expensesSelectors } from "@/components/expenses/slice.ts";
import type { Expense } from "@/components/expense.ts";
import { ExpenseListItem } from "@/components/expenses/history/expense-list-item.tsx";
import { Badge } from "../ui/badge";
import { Drawer, DrawerContent } from "@/components/ui/drawer.tsx";
import { cn } from "@/lib/utils.ts";
import { DateFilterDrawerContent } from "@/components/search/filters/date/date-filter-drawer-content.tsx";
import { CategoriesFilterDrawerContent } from "@/components/search/filters/categories/categories-filter-drawer-content.tsx";
import {
    getDateFilterStr,
    isMatchingDateFilter,
} from "@/components/search/filters/date/date-filter.ts";
import {
    isMatchingCategoryFilter,
    type SelectedCategoriesFilter,
} from "@/components/search/filters/categories/categories-filter.ts";
import { isMatchingSearchFilter } from "@/components/search/filters/text/text-filter.ts";

export const SearchPage = () => {
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState<{
        type?: "date" | "categories";
        isOpen: boolean;
    }>({ isOpen: false });

    const expenses = useAppSelector(expensesSelectors.selectAll);

    useEffect(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    const [dateFilterOption, setDateFilterOption] = useState<
        "any" | "oneWeek" | "oneMonth" | "halfYear" | "oneYear"
    >("any");
    const [selectedCategories, setSelectedCategories] =
        useState<SelectedCategoriesFilter>({ isActive: false, categories: [] });

    const filteredExpenses: Expense[] = useMemo(() => {
        if (search.trim() === "") {
            return expenses
                .filter((e) => isMatchingDateFilter(e, dateFilterOption))
                .filter((e) => isMatchingCategoryFilter(e, selectedCategories));
        }

        const searchLower = search.toLowerCase();
        return expenses
            .filter((e) => isMatchingDateFilter(e, dateFilterOption))
            .filter((e) => isMatchingCategoryFilter(e, selectedCategories))
            .filter((e) => isMatchingSearchFilter(e, searchLower));
    }, [dateFilterOption, expenses, search, selectedCategories]);

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
                    {isDrawerOpen.type === "date" ? (
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
                    ) : isDrawerOpen.type === "categories" ? (
                        <CategoriesFilterDrawerContent
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            closeDrawer={() => {
                                setIsDrawerOpen((prev) => ({
                                    ...prev,
                                    isOpen: false,
                                }));
                            }}
                        />
                    ) : null}
                </DrawerContent>
                <div
                    className={
                        "border-outline bg-surface-container-highest flex h-16 w-dvw shrink-0 items-center border-b py-2"
                    }
                >
                    <button
                        onClick={() => {
                            history.back();
                        }}
                        className={"text-on-surface cursor-pointer px-4"}
                    >
                        <ArrowLeft className={"size-6"} />
                    </button>
                    <input
                        ref={inputRef}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={"border-none text-lg outline-none"}
                        placeholder={"Ausgabe"}
                    />
                    <button
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
                    <Badge
                        variant={"md3"}
                        className={cn(
                            "ml-2 flex gap-x-1",
                            selectedCategories.isActive &&
                                "bg-secondary-container text-on-secondary-container outline-outline",
                        )}
                        onClick={() => {
                            setIsDrawerOpen({
                                type: "categories",
                                isOpen: true,
                            });
                        }}
                    >
                        <div className={"text-on-surface font-medium"}>
                            {!selectedCategories.isActive
                                ? "Kategorien"
                                : selectedCategories.categories.length +
                                  " Kategorien"}
                        </div>
                        <div>
                            <ChevronDown className={"size-4"} strokeWidth={2} />
                        </div>
                    </Badge>
                </div>
                {filteredExpenses.length === 0 && search !== "" && (
                    <div className={"my-auto text-center"}>
                        <h3 className={"text-outline text-xl"}>
                            Keine Ergebnisse
                        </h3>
                    </div>
                )}
                <div className={"flex w-full flex-col"}>
                    {filteredExpenses.length > 0 &&
                        filteredExpenses.map((e) => (
                            <ExpenseListItem key={e.id} transaction={e} />
                        ))}
                </div>
            </Drawer>
        </div>
    );
};
