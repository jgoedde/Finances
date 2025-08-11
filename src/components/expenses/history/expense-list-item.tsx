import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { ChevronRight, MessageCircleQuestion } from "lucide-react";
import { useRipple } from "@/hooks/use-ripple.ts";
import { convertHexToTonal } from "@/lib/color-utils.ts";
import { useColorScheme } from "@mantine/hooks";
import { cn } from "@/lib/utils.ts";
import { useNavigate } from "@tanstack/react-router";
import type { Expense } from "@/persistence/types.ts";
import { useCategories } from "@/components/expenses/use-categories.ts";
import { formatEuro } from "@/lib/currency-utils.ts";

// I'm lazy now, so we query the categories additionally instead of joining them in the query in the first place.

export function ExpenseListItem({ expense }: { expense: Expense }) {
    const rippleHandlers = useRipple();
    const theme = useColorScheme();

    const categories = useCategories();

    const category = categories.find(
        (category) => category.id === expense.category_id,
    );

    function getSupportingText() {
        if (expense.description != null) {
            return expense.description;
        }

        if (category) {
            return category.name;
        }

        return "Keine Beschreibung";
    }

    const navigate = useNavigate();

    function onEditButtonClick() {
        setTimeout(() => {
            void navigate({ to: "/edit/$id", params: { id: expense.id } });
        }, 150);
    }

    const tonal = convertHexToTonal(category?.color ?? "#2f2");
    const backgroundColor =
        theme === "dark" ? tonal.dark.container : tonal.light.container;

    const textColor =
        theme === "dark" ? tonal.dark.onContainer : tonal.light.onContainer;

    return (
        <div
            className={
                "ripple-container flex w-full flex-row items-center gap-x-3 rounded-md py-1.5"
            }
            data-ripple-color={"bg-on-surface/10"}
            {...rippleHandlers}
        >
            <div
                className={
                    "text-on-surface-variant flex size-10 min-w-8 shrink-0 items-center justify-center rounded-full"
                }
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
                        {expense.name}{" "}
                        <ChevronRight className={"text-outline size-4"} />
                    </button>
                </div>
                <div
                    className={
                        "text-on-surface-variant line-clamp-2 text-sm/5 break-all"
                    }
                >
                    {getSupportingText()}
                </div>
            </div>
            <div
                className={cn(
                    "flex items-center gap-x-2 justify-self-end font-medium",
                    expense.amount < 0 && "text-[#3FFF68]",
                )}
            >
                {expense.amount < 0 ? (
                    <div>+{formatEuro(expense.amount).split("-")[1]}</div>
                ) : (
                    <div>{formatEuro(expense.amount)}</div>
                )}
            </div>
        </div>
    );
}
