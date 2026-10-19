import { formatCurrency } from "@finances/shared";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { Filter } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx";
import { useCategories } from "#/features/transactions/transaction-queries.ts";
import { useMonthCategoryTotals } from "#/features/transactions/components/list/use-month-category-totals.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

const transactionsRoute = getRouteApi("/_authed/_shell/_transactions");

// Radio value of "All categories"; category ids are never empty.
const ALL = "";

/**
 * Filter button beside the month: a menu with the month's categories, largest
 * first. A dot badge shows while a category is selected.
 */
export function CategoryFilterMenu() {
    const { category: selected } = transactionsRoute.useSearch();
    const totals = useMonthCategoryTotals();
    const selectedName = useCategories().find(
        (category) => category.id === selected,
    )?.name;

    const navigate = useNavigate();

    function onValueChange(value: string) {
        void navigate({
            to: "/transactions",
            search: {
                category: value === ALL ? undefined : value,
                q: undefined,
                older: undefined,
            },
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={"relative"}
                    aria-label={
                        selectedName === undefined
                            ? m.transaction_filter()
                            : m.transaction_filter_active({
                                  category: selectedName,
                              })
                    }
                >
                    <Filter />
                    {selected !== undefined && (
                        // MD3 small badge (6dp).
                        <span
                            aria-hidden
                            className={`absolute top-2 right-2 size-1.5
                            rounded-full bg-error`}
                        />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={"end"} className={"min-w-56"}>
                <DropdownMenuRadioGroup
                    value={selected ?? ALL}
                    onValueChange={onValueChange}
                >
                    <DropdownMenuRadioItem value={ALL}>
                        {m.transaction_filter_all()}
                    </DropdownMenuRadioItem>
                    {totals.length > 0 && <DropdownMenuSeparator />}
                    {totals.map(({ category, total }) => (
                        <DropdownMenuRadioItem
                            key={category.id}
                            value={category.id}
                        >
                            <span
                                aria-hidden
                                className={"size-2.5 shrink-0 rounded-full"}
                                style={{ backgroundColor: category.color }}
                            />
                            <span className={"min-w-0 grow truncate"}>
                                {category.name}
                            </span>
                            <span
                                className={
                                    "text-label-medium text-on-surface-variant"
                                }
                            >
                                {formatCurrency(total, getLocale())}
                            </span>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
