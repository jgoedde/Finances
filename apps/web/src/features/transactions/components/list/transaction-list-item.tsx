import { useRef } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { Transaction } from "@finances/shared";
import { useRipple } from "#/hooks/use-ripple.ts";
import { useCategories } from "#/features/categories/category-queries.ts";
import { cn } from "#/lib/cn.ts";
import * as haptics from "#/lib/haptics.ts";
import { useTransactionActions } from "#/features/transactions/components/list/use-transaction-actions.ts";
import { TransactionAvatar } from "#/features/transactions/components/list/transaction-avatar.tsx";
import { TransactionListItemText } from "#/features/transactions/components/list/transaction-list-item-text.tsx";
import { TransactionListItemAmount } from "#/features/transactions/components/list/transaction-list-item-amount.tsx";
import { TransactionActionsButton } from "#/features/transactions/components/list/transaction-actions-button.tsx";
import { TransactionMenuItems } from "#/features/transactions/components/list/transaction-menu-items.tsx";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "#/components/ui/context-menu.tsx";

// I'm lazy now, so we query the categories additionally instead of joining them in the query in the first place.

interface TransactionListItemProps {
    transaction: Transaction;

    /**
     * Shown before the supporting text, e.g. when an upcoming transaction is
     * due.
     */
    dateLabel?: string;

    /**
     * Fades from highlighted, e.g. where "Show in month" landed.
     */
    highlighted?: boolean;

    /**
     * A main expense's occasion total, shown small below its own amount.
     */
    total?: number;

    /**
     * The main expense of an attached expense shown on its own, for the
     * "belongs to" hint.
     */
    mainExpense?: Transaction;

    /**
     * The smaller row of an attached expense below its main expense.
     */
    compact?: boolean;
}

export function TransactionListItem({
    transaction,
    dateLabel,
    highlighted = false,
    total,
    mainExpense,
    compact = false,
}: TransactionListItemProps) {
    const rippleHandlers = useRipple();

    const categories = useCategories();
    const category = categories.find(
        (category) => category.id === transaction.categoryId,
    );

    const navigate = useNavigate();
    // Open in the detail pane beside the list.
    const isSelected =
        useParams({
            from: "/_authed/_shell/_transactions/edit/$id",
            shouldThrow: false,
        })?.id === transaction.id;

    function onEditButtonClick() {
        setTimeout(() => {
            void navigate({ to: "/edit/$id", params: { id: transaction.id } });
        }, 150);
    }

    // Opened by a long press (touch), a right click or the three-dot button.
    const getActions = useTransactionActions(transaction, () => {
        if (isSelected) {
            void navigate({ to: "/transactions" });
        }
    });

    // The pointer that last pressed the row: only a long press ticks when the
    // context menu opens, not a right click.
    const pointerTypeRef = useRef<string>(undefined);

    return (
        <div className={"flex w-full items-center"}>
            <ContextMenu
                onOpenChange={(open) => {
                    if (open && pointerTypeRef.current === "touch") {
                        haptics.tick();
                    }
                }}
            >
                <ContextMenuTrigger
                    asChild
                    onPointerDown={(event) => {
                        pointerTypeRef.current = event.pointerType;
                    }}
                >
                    <button
                        type={"button"}
                        className={cn(
                            `ripple-container state-layer flex min-w-0 flex-1
                            cursor-pointer flex-row items-center rounded-md px-2
                            text-left focus-ring`,
                            compact
                                ? "min-h-10 gap-x-3 py-1"
                                : "min-h-14 gap-x-4 py-2",
                            isSelected && "bg-secondary-container",
                            highlighted &&
                                `animate-highlight-fade
                                motion-reduce:[animation-timing-function:steps(1,end)]`,
                        )}
                        aria-current={isSelected || undefined}
                        data-ripple-color={"bg-on-surface/10"}
                        {...rippleHandlers}
                        onClick={(e) => {
                            rippleHandlers.onClick(e);
                            onEditButtonClick();
                        }}
                    >
                        <TransactionAvatar
                            category={category}
                            compact={compact}
                        />
                        <TransactionListItemText
                            transaction={transaction}
                            category={category}
                            dateLabel={dateLabel}
                            mainExpense={mainExpense}
                            compact={compact}
                        />
                        <TransactionListItemAmount
                            transaction={transaction}
                            total={total}
                            compact={compact}
                        />
                    </button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <TransactionMenuItems
                        date={transaction.date}
                        getActions={getActions}
                        Item={ContextMenuItem}
                    />
                </ContextMenuContent>
            </ContextMenu>
            <TransactionActionsButton
                date={transaction.date}
                getActions={getActions}
                compact={compact}
            />
        </div>
    );
}
