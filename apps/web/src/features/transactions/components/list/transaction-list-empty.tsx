import { formatMonthYear } from "@finances/shared";
import { useNavigate } from "@tanstack/react-router";
import FilterOffIcon from "~icons/material-symbols/filter-alt-off-outline-rounded";
import ReceiptIcon from "~icons/material-symbols/receipt-long-outline-rounded";
import { Button } from "#/components/ui/button.tsx";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "#/components/ui/empty.tsx";
import { useCategories } from "#/features/categories/category-queries.ts";
import { getCategoryName } from "#/features/transactions/utils/transaction-utils.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface TransactionListEmptyProps {
    month: Date;

    /**
     * The id of the category the list is filtered by, if any.
     */
    category: string | undefined;
}

/**
 * Shown when the month (in the selected category) has no transactions; a
 * filtered list offers to clear the filter.
 */
export function TransactionListEmpty({
    month,
    category,
}: TransactionListEmptyProps) {
    const navigate = useNavigate();
    const selected = useCategories().find((it) => it.id === category);
    const period = formatMonthYear(month, getLocale());

    function clearFilter() {
        void navigate({
            to: "/transactions",
            search: { category: undefined, q: undefined, older: undefined },
        });
    }

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia>
                    {selected ? <FilterOffIcon /> : <ReceiptIcon />}
                </EmptyMedia>
                <EmptyTitle>{m.transaction_list_empty_title()}</EmptyTitle>
                <EmptyDescription>
                    {selected
                        ? m.transaction_list_filtered_empty({
                              category: getCategoryName(selected.name),
                              period,
                          })
                        : m.transaction_list_empty({ period })}
                </EmptyDescription>
            </EmptyHeader>
            {selected && (
                <EmptyContent>
                    <Button variant={"outline"} onClick={clearFilter}>
                        {m.transaction_filter_clear()}
                    </Button>
                </EmptyContent>
            )}
        </Empty>
    );
}
