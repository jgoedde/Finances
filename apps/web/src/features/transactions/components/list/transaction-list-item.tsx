import { formatCurrency } from "@finances/shared";
import { DynamicIcon } from "lucide-react/dynamic";
import {
    ChevronRight,
    CloudUpload,
    CornerDownRight,
    EllipsisVertical,
    MessageCircleQuestion,
} from "lucide-react";
import { useRipple } from "#/hooks/use-ripple.ts";
import { paletteFromHex, toneStyle } from "#/utils/color.ts";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { Transaction } from "@finances/shared";
import { useCategories } from "#/features/categories/category-queries.ts";
import { usePendingChanges } from "#/features/sync/use-sync-status.ts";
import { cn } from "#/lib/cn.ts";
import * as haptics from "#/lib/haptics.ts";
import { type ComponentProps, useRef } from "react";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";
import { getCategoryName } from "#/features/transactions/utils/transaction-utils.ts";
import {
    type TransactionAction,
    useTransactionActions,
} from "#/features/transactions/components/list/use-transaction-actions.ts";
import { useQuery } from "@tanstack/react-query";
import { monthTransactionsQuery } from "#/features/transactions/transaction-queries.ts";
import { Button } from "#/components/ui/button.tsx";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "#/components/ui/context-menu.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx";

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
    const isPending = usePendingChanges().some(
        (change) => change.transaction.id === transaction.id,
    );

    const category = categories.find(
        (category) => category.id === transaction.categoryId,
    );

    function getSupportingText() {
        if (transaction.description != null) {
            return transaction.description;
        }

        if (category) {
            return getCategoryName(category.name);
        }

        return m.transaction_no_description();
    }

    // A compact row leads with what the attached expense was for (the
    // counterparty is often the main expense's) and names its counterparty and category below.
    const headline = compact
        ? (transaction.description ?? transaction.counterparty)
        : transaction.counterparty;
    const supportingText = compact
        ? [
              transaction.description != null && transaction.counterparty,
              category && getCategoryName(category.name),
          ]
              .filter(Boolean)
              .join(" · ")
        : getSupportingText();

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
                        <div
                            className={cn(
                                `flex shrink-0 items-center justify-center
                                rounded-full bg-(--tone) text-(--on-tone) tone`,
                                compact ? "size-7" : "size-10",
                            )}
                            style={toneStyle(
                                paletteFromHex(category?.color ?? "#2f2"),
                            )}
                        >
                            {category != null ? (
                                <DynamicIcon
                                    name={
                                        category.iconName as ComponentProps<
                                            typeof DynamicIcon
                                        >["name"]
                                    }
                                    className={compact ? "size-4" : "size-6"}
                                />
                            ) : (
                                <MessageCircleQuestion
                                    className={compact ? "size-4" : "size-6"}
                                />
                            )}
                        </div>
                        <div className={"flex min-w-0 flex-1 flex-col"}>
                            <div
                                className={cn(
                                    `inline-flex items-center gap-x-1
                                    text-on-surface`,
                                    compact
                                        ? "text-body-medium"
                                        : "text-body-large",
                                )}
                            >
                                {headline}
                                {!compact && (
                                    <ChevronRight
                                        className={`size-4 shrink-0
                                        text-on-surface-variant`}
                                    />
                                )}
                            </div>
                            <div
                                className={cn(
                                    `line-clamp-2 break-all
                                    text-on-surface-variant`,
                                    compact
                                        ? "text-body-small"
                                        : "text-body-medium",
                                )}
                            >
                                {dateLabel === undefined
                                    ? supportingText
                                    : `${dateLabel} · ${supportingText}`}
                            </div>
                            {mainExpense && (
                                <div
                                    className={`inline-flex items-center gap-x-1
                                    text-body-small text-on-surface-variant`}
                                >
                                    <CornerDownRight
                                        className={"size-3.5 shrink-0"}
                                    />
                                    {m.transaction_belongs_to({
                                        counterparty: mainExpense.counterparty,
                                    })}
                                </div>
                            )}
                        </div>
                        <div
                            className={cn(
                                `flex shrink-0 items-center gap-x-2
                                text-on-surface`,
                                compact
                                    ? "text-label-medium"
                                    : "text-label-large",
                                transaction.kind === "income" && "text-income",
                            )}
                        >
                            {isPending && (
                                <CloudUpload
                                    role={"img"}
                                    aria-label={m.sync_not_synced_yet()}
                                    className={"size-4 text-on-surface-variant"}
                                />
                            )}
                            <div className={"flex flex-col items-end"}>
                                <div>
                                    {transaction.kind === "income" && "+"}
                                    {formatCurrency(
                                        transaction.amount,
                                        getLocale(),
                                    )}
                                </div>
                                {total !== undefined && (
                                    <div
                                        className={`text-label-small
                                        text-on-surface-variant`}
                                    >
                                        {m.transaction_main_expense_total({
                                            amount: formatCurrency(
                                                total,
                                                getLocale(),
                                            ),
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <MenuItems
                        date={transaction.date}
                        getActions={getActions}
                        Item={ContextMenuItem}
                    />
                </ContextMenuContent>
            </ContextMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type={"button"}
                        variant={"ghost"}
                        size={"icon"}
                        aria-label={m.transaction_actions()}
                        className={cn(
                            `shrink-0 text-on-surface-variant
                            pointer-coarse:hidden`,
                            compact && "size-8",
                        )}
                    >
                        <EllipsisVertical
                            className={compact ? "size-4" : "size-5"}
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={"end"}>
                    <MenuItems
                        date={transaction.date}
                        getActions={getActions}
                        Item={DropdownMenuItem}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

/**
 * The menu's items; only rendered while it is open, so the actions are only
 * worked out then, once the month of `date` is loaded (e.g. for a search
 * result).
 */
function MenuItems({
    date,
    getActions,
    Item,
}: {
    date: number;
    getActions: (isMonthLoaded: boolean) => TransactionAction[];
    Item: typeof ContextMenuItem | typeof DropdownMenuItem;
}) {
    const { isSuccess } = useQuery(monthTransactionsQuery(date));
    return getActions(isSuccess).map(({ label, icon: Icon, onSelect }) => (
        <Item key={label} onSelect={onSelect}>
            <Icon />
            {label}
        </Item>
    ));
}
