import type { Expense } from "@/components/use-expenses.ts";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useMemo } from "react";

export const ExpenseListItem = ({
    transaction: { name, description, category, amountFormatted },
}: {
    transaction: Expense;
}) => {
    const supportingText = useMemo(() => {
        if (description?.trim() !== "") {
            return description;
        } else {
            return category.name;
        }
    }, [category.name, description]);

    return (
        <div className={"flex w-full max-w-sm flex-row items-center gap-x-3"}>
            <DynamicIcon
                name={category.iconName as IconName}
                className={"text-on-surface-variant size-8 shrink-0"}
            />
            <div className={"flex flex-1 flex-col"}>
                <div className={"text-on-surface font-medium"}>{name}</div>
                <div
                    className={"text-on-surface-variant line-clamp-2 text-sm/5"}
                >
                    {supportingText}
                </div>
            </div>
            <div className={"text-on-surface-variant justify-self-end"}>
                {amountFormatted}
            </div>
        </div>
    );
};
