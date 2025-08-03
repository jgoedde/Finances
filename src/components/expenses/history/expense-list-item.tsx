import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useLocation } from "wouter";
import { ChevronRight } from "lucide-react";
import { useRipple } from "@/hooks/use-ripple.ts";
import { convertHexToTonal } from "@/lib/color-utils.ts";
import type { Expense } from "@/components/expense.ts";
import { useColorScheme } from "@mantine/hooks";
import { cn } from "@/lib/utils.ts";

export const ExpenseListItem = ({
    transaction: { id, name, description, category, amountFormatted, amount },
}: {
    transaction: Expense;
}) => {
    const [, route] = useLocation();
    const rippleHandlers = useRipple();
    const theme = useColorScheme();

    const supportingText =
        description?.trim() !== "" ? description : category.name;

    function onEditButtonClick() {
        setTimeout(() => {
            route(`/edit/${id}`);
        }, 150);
    }

    const tonal = convertHexToTonal(category.color);
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
                <DynamicIcon
                    name={category.iconName as IconName}
                    className={"size-7"}
                    style={{
                        color: textColor,
                    }}
                />
            </div>
            <div className={"flex flex-1 flex-col"}>
                <div className={"text-on-surface font-medium"}>
                    <button
                        onClick={() => onEditButtonClick()}
                        className={"inline-flex items-center gap-x-1"}
                    >
                        {name}{" "}
                        <ChevronRight className={"text-outline size-4"} />
                    </button>
                </div>
                <div
                    className={
                        "text-on-surface-variant line-clamp-2 text-sm/5 break-all"
                    }
                >
                    {supportingText}
                </div>
            </div>
            <div
                className={cn(
                    "flex items-center gap-x-2 justify-self-end font-medium",
                    amount < 0 && "text-[#3FFF68]",
                )}
            >
                {amount < 0 ? (
                    <div>+{amountFormatted.split("-")[1]}</div>
                ) : (
                    <div>{amountFormatted}</div>
                )}
            </div>
        </div>
    );
};
