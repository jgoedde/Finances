import type { Expense } from "@/components/use-expenses.ts";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

export const ExpenseListItem = ({
    transaction: { name, description, category, amountFormatted },
}: {
    transaction: Expense;
}) => (
    <div className={"flex w-full max-w-sm flex-row items-center gap-x-3"}>
        <DynamicIcon
            name={category.iconName as IconName}
            className={"text-on-surface-variant size-8 shrink-0"}
        />
        <div className={"flex flex-1 flex-col"}>
            <div className={"text-on-surface font-medium"}>{name}</div>
            <div className={"text-on-surface-variant line-clamp-2 text-sm/5"}>
                {(description ?? "").trim() === ""
                    ? category.name
                    : description}
            </div>
        </div>
        <div className={"text-on-surface-variant justify-self-end"}>
            {amountFormatted}
        </div>
    </div>
);
