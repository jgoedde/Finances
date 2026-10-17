import { DynamicIcon } from "lucide-react/dynamic";
import { ChevronRight, MessageCircleQuestion } from "lucide-react";
import { useRipple } from "@/hooks/use-ripple.ts";
import { convertHexToTonal } from "@/utils/color.ts";
import { useColorScheme } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import type { Transaction } from "@/persistence/types.ts";
import { useCategories } from "@/features/transactions/use-categories.ts";
import { formatEuro } from "@/utils/currency.ts";
import { cn } from "@/lib/cn.ts";
import type { ComponentProps } from "react";

// I'm lazy now, so we query the categories additionally instead of joining them in the query in the first place.

type TransactionListItemProps = {
    transaction: Transaction;
};

export function TransactionListItem({ transaction }: TransactionListItemProps) {
    const rippleHandlers = useRipple();
    const theme = useColorScheme();

    const categories = useCategories();

    const category = categories.find(
        (category) => category.id === transaction.category_id,
    );

    function getSupportingText() {
        if (transaction.description != null) {
            return transaction.description;
        }

        if (category) {
            return category.name;
        }

        return "Keine Beschreibung";
    }

    const navigate = useNavigate();

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
            className={`ripple-container state-layer focus-ring flex min-h-14
                w-full cursor-pointer flex-row items-center gap-x-4 rounded-md
                px-2 py-2 text-left`}
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
                            category.icon_name as ComponentProps<
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
                    className={`text-on-surface text-body-large inline-flex
                        items-center gap-x-1`}
                >
                    {transaction.name}
                    <ChevronRight
                        className={"text-on-surface-variant size-4 shrink-0"}
                    />
                </div>
                <div
                    className={`text-on-surface-variant text-body-medium
                        line-clamp-2 break-all`}
                >
                    {getSupportingText()}
                </div>
            </div>
            <div
                className={cn(
                    `text-label-large text-on-surface flex shrink-0 items-center
                    gap-x-2`,
                    transaction.amount < 0 && "text-income",
                )}
            >
                {transaction.amount < 0 ? (
                    <div>+{formatEuro(transaction.amount).split("-")[1]}</div>
                ) : (
                    <div>{formatEuro(transaction.amount)}</div>
                )}
            </div>
        </button>
    );
}
