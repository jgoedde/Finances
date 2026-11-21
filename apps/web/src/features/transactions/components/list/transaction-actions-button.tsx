import EllipsisVertical from "~icons/material-symbols/more-vert-rounded";
import { Button } from "#/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx";
import { TransactionMenuItems } from "#/features/transactions/components/list/transaction-menu-items.tsx";
import type { TransactionAction } from "#/features/transactions/components/list/use-transaction-actions.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

interface TransactionActionsButtonProps {
    date: number;
    getActions: (isMonthLoaded: boolean) => TransactionAction[];
    compact: boolean;
}

/**
 * The three-dot button that opens the transaction's actions; hidden on
 * touch screens, where a long press opens them.
 */
export function TransactionActionsButton({
    date,
    getActions,
    compact,
}: TransactionActionsButtonProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type={"button"}
                    variant={"ghost"}
                    size={"icon"}
                    aria-label={m.transaction_actions()}
                    className={cn(
                        "shrink-0 text-on-surface-variant pointer-coarse:hidden",
                        compact && "size-8",
                    )}
                >
                    <EllipsisVertical
                        className={compact ? "size-4" : "size-5"}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={"end"}>
                <TransactionMenuItems
                    date={date}
                    getActions={getActions}
                    Item={DropdownMenuItem}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
