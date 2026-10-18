import { DynamicIcon } from "lucide-react/dynamic";
import { ChevronRight, CloudUpload, MessageCircleQuestion } from "lucide-react";
import { useRipple } from "#/hooks/use-ripple.ts";
import { convertHexToTonal } from "#/utils/color.ts";
import { useColorScheme } from "@mantine/hooks";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { Transaction } from "@finances/shared";
import { useCategories } from "#/features/transactions/transaction-queries.ts";
import { formatEuro } from "#/utils/currency.ts";
import { usePendingChanges } from "#/features/sync/use-sync-status.ts";
import { cn } from "#/lib/cn.ts";
import type { ComponentProps } from "react";
import { m } from "#/paraglide/messages.js";

// I'm lazy now, so we query the categories additionally instead of joining them in the query in the first place.

interface TransactionListItemProps {
    transaction: Transaction;
}

export function TransactionListItem({ transaction }: TransactionListItemProps) {
    const rippleHandlers = useRipple();
    const theme = useColorScheme();

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
            return category.name;
        }

        return m.transaction_no_description();
    }

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

    const tonal = convertHexToTonal(category?.color ?? "#2f2");
    const backgroundColor =
        theme === "dark" ? tonal.dark.container : tonal.light.container;

    const textColor =
        theme === "dark" ? tonal.dark.onContainer : tonal.light.onContainer;

    return (
        <button
            type={"button"}
            className={cn(
                `ripple-container state-layer flex min-h-14 w-full
                cursor-pointer flex-row items-center gap-x-4 rounded-md px-2
                py-2 text-left focus-ring`,
                isSelected && "bg-secondary-container",
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
                className={`flex size-10 shrink-0 items-center justify-center
                    rounded-full`}
                style={{
                    backgroundColor,
                }}
            >
                {category != null ? (
                    <DynamicIcon
                        name={
                            category.iconName as ComponentProps<
                                typeof DynamicIcon
                            >["name"]
                        }
                        className={"size-6"}
                        style={{
                            color: textColor,
                        }}
                    />
                ) : (
                    <MessageCircleQuestion
                        className={"size-6"}
                        style={{
                            color: textColor,
                        }}
                    />
                )}
            </div>
            <div className={"flex min-w-0 flex-1 flex-col"}>
                <div
                    className={`inline-flex items-center gap-x-1 text-body-large
                        text-on-surface`}
                >
                    {transaction.name}
                    <ChevronRight
                        className={"size-4 shrink-0 text-on-surface-variant"}
                    />
                </div>
                <div
                    className={`line-clamp-2 text-body-medium break-all
                        text-on-surface-variant`}
                >
                    {getSupportingText()}
                </div>
            </div>
            <div
                className={cn(
                    `flex shrink-0 items-center gap-x-2 text-label-large
                    text-on-surface`,
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
                {transaction.kind === "income" ? (
                    <div>+{formatEuro(transaction.amount)}</div>
                ) : (
                    <div>{formatEuro(transaction.amount)}</div>
                )}
            </div>
        </button>
    );
}
