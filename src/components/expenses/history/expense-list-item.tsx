import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { ChevronRight } from "lucide-react";
import { useRipple } from "@/hooks/use-ripple.ts";
import { convertHexToTonal } from "@/lib/color-utils.ts";
import { useTheme } from "@/components/theme-provider.tsx";
import type { Expense } from "@/components/expense.ts";

export const ExpenseListItem = ({
    transaction: { id, name, description, category, amountFormatted },
}: {
    transaction: Expense;
}) => {
    const [, route] = useLocation();
    const rippleHandlers = useRipple();
    const { theme } = useTheme();

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

    const tonal = useMemo(() => {
        return convertHexToTonal(category.color);
    }, [category.color]);

    const backgroundColor = useMemo(() => {
        return theme === "dark" ? tonal.dark.container : tonal.light.container;
    }, [theme, tonal.dark.container, tonal.light.container]);

    const textColor = useMemo(() => {
        return theme === "dark"
            ? tonal.dark.onContainer
            : tonal.light.onContainer;
    }, [theme, tonal.dark.onContainer, tonal.light.onContainer]);

    return (
        <div
            className={
                "ripple-container mx-auto flex w-full flex-row items-center gap-x-3 rounded-md px-2 py-1.5"
            }
            style={{
                width: "calc(100% - calc(var(--spacing) * 4))",
            }}
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
                className={
                    "flex items-center gap-x-2 justify-self-end font-medium"
                }
            >
                <div>{amountFormatted}</div>
            </div>
        </div>
    );
};
