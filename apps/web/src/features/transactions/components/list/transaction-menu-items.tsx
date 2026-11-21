import { useQuery } from "@tanstack/react-query";
import type { ContextMenuItem } from "#/components/ui/context-menu.tsx";
import type { DropdownMenuItem } from "#/components/ui/dropdown-menu.tsx";
import type { TransactionAction } from "#/features/transactions/components/list/use-transaction-actions.ts";
import { monthTransactionsQuery } from "#/features/transactions/transaction-queries.ts";

interface TransactionMenuItemsProps {
    date: number;
    getActions: (isMonthLoaded: boolean) => TransactionAction[];
    Item: typeof ContextMenuItem | typeof DropdownMenuItem;
}

/**
 * The menu's items; only rendered while it is open, so the actions are only
 * worked out then, once the month of `date` is loaded (e.g. for a search
 * result).
 */
export function TransactionMenuItems({
    date,
    getActions,
    Item,
}: TransactionMenuItemsProps) {
    const { isSuccess } = useQuery(monthTransactionsQuery(date));
    return getActions(isSuccess).map(({ label, icon: Icon, onSelect }) => (
        <Item key={label} onSelect={onSelect}>
            <Icon />
            {label}
        </Item>
    ));
}
