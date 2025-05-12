import type { Expense } from "@/components/use-expenses.ts";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useCallback, useMemo } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useAppDispatch } from "@/hooks.ts";
import { removeExpense } from "@/components/expenses/slice.ts";
import { saveToLocalStorage } from "@/components/expenses/actions.ts";
import { useEncryption } from "@/components/use-encryption.ts";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils.ts";
import { ChevronRight } from "lucide-react";

export const ExpenseListItem = ({
    transaction: { id, name, description, category, amountFormatted },
}: {
    transaction: Expense;
}) => {
    const dispatch = useAppDispatch();

    const { key } = useEncryption();
    const [, route] = useLocation();

    const supportingText = useMemo(() => {
        if (description?.trim() !== "") {
            return description;
        } else {
            return category.name;
        }
    }, [category.name, description]);

    const onDeleteDropdownMenuItemClick = useCallback(() => {
        if (!key) {
            return;
        }

        dispatch(removeExpense(id));
        void dispatch(saveToLocalStorage({ encryptionKey: key }));
    }, [dispatch, id, key]);

    const onEditDropdownMenuItemClick = useCallback(() => {
        route(`/edit/${id}`);
    }, [route, id]);

    return (
        <DropdownMenu>
            <div
                className={cn(
                    "flex w-full flex-row items-center gap-x-3 py-1.5 pl-4",
                )}
            >
                <DynamicIcon
                    name={category.iconName as IconName}
                    className={"text-on-surface-variant size-8 shrink-0"}
                />
                <div className={"flex flex-1 flex-col"}>
                    <div className={"text-on-surface font-medium"}>
                        <DropdownMenuTrigger asChild>
                            <span
                                className={"inline-flex items-center gap-x-1"}
                            >
                                {name}{" "}
                                <ChevronRight
                                    className={"text-outline size-4"}
                                />
                            </span>
                        </DropdownMenuTrigger>
                    </div>
                    <div
                        className={
                            "text-on-surface-variant line-clamp-2 text-sm/5"
                        }
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
            <DropdownMenuContent>
                <DropdownMenuItem onClick={onEditDropdownMenuItemClick}>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    variant={"destructive"}
                    onClick={onDeleteDropdownMenuItemClick}
                >
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
