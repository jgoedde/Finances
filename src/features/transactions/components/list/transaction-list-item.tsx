import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { ChevronRight, MessageCircleQuestion } from "lucide-react";
import { useRipple } from "@/hooks/use-ripple.ts";
import { convertHexToTonal } from "@/utils/color.ts";
import { useColorScheme } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import type { Transaction } from "@/persistence/types.ts";
import { useCategories } from "@/features/transactions/use-categories.ts";
import { formatEuro } from "@/utils/currency.ts";
import { cn } from "@/lib/cn.ts";

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
        <div
            className={`ripple-container flex w-full flex-row items-center
                gap-x-3 rounded-md py-1.5`}
            data-ripple-color={"bg-on-surface/10"}
            {...rippleHandlers}
        >
            <div
                className={`text-on-surface-variant flex size-10 min-w-8
                    shrink-0 items-center justify-center rounded-full`}
                style={{
                    backgroundColor,
                }}
            >
                {category != null ? (
                    <DynamicIcon
                        name={category.icon_name as IconName}
                        className={"size-7"}
                        style={{
                            color: textColor,
                        }}
                    />
                ) : (
                    <MessageCircleQuestion
                        className={"size-7"}
                        style={{
                            color: textColor,
                        }}
                    />
                )}
            </div>
            <div className={"flex flex-1 flex-col"}>
                <div className={"text-on-surface font-medium"}>
                    <button
                        type={"button"}
                        onClick={() => onEditButtonClick()}
                        className={"inline-flex items-center gap-x-1"}
                    >
                        {transaction.name}{" "}
                        <ChevronRight className={"text-outline size-4"} />
                    </button>
                </div>
                <div
                    className={`text-on-surface-variant line-clamp-2 text-sm/5
                        break-all`}
                >
                    {getSupportingText()}
                </div>
            </div>
            <div
                className={cn(
                    "flex items-center gap-x-2 justify-self-end font-medium",
                    transaction.amount < 0 && "text-[#3FFF68]",
                )}
            >
                {transaction.amount < 0 ? (
                    <div>+{formatEuro(transaction.amount).split("-")[1]}</div>
                ) : (
                    <div>{formatEuro(transaction.amount)}</div>
                )}
            </div>
        </div>
    );
}
