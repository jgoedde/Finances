import type { Expense } from "@/components/use-expenses.ts";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { ChevronRight } from "lucide-react";
import { useRipple } from "@/hooks/use-ripple.ts";

export const ExpenseListItem = ({
    transaction: { id, name, description, category, amountFormatted },
}: {
    transaction: Expense;
}) => {
    const [, route] = useLocation();
    const rippleHandlers = useRipple();

    const supportingText = useMemo(() => {
        if (description?.trim() !== "") {
            return description;
        } else {
            return category.name;
        }
    }, [category.name, description]);

    const onEditButtonClick = useCallback(() => {
        setTimeout(() => {
            route(`/edit/${id}`);
        }, 150);
    }, [route, id]);

    return (
        <div
            className={
                "ripple-container flex w-full flex-row items-center gap-x-3 py-1.5 pl-4"
            }
            data-ripple-color={"bg-on-surface/10"}
            {...rippleHandlers}
        >
            <div className={"text-on-surface-variant min-w-8 shrink-0"}>
                <DynamicIcon
                    name={category.iconName as IconName}
                    className={"size-8"}
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
                    className={"text-on-surface-variant line-clamp-2 text-sm/5"}
                >
                    {supportingText}
                </div>
            </div>
            <div
                className={
                    "text-on-surface-variant flex items-center gap-x-2 justify-self-end pr-4"
                }
            >
                <div>{amountFormatted}</div>
            </div>
        </div>
    );
};
