import { type FC, useCallback, useMemo, useState } from "react";
import type { Expense } from "@/components/expense.ts";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer.tsx";
import { Calendar, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import { addDays, addWeeks, isAfter, isSameDay, isToday } from "date-fns";
import { useAppSelector } from "@/redux-hooks.ts";
import { selectAllExpenses } from "@/components/expenses/slice.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { ExpenseListItem } from "@/components/expenses/history/expense-list-item.tsx";
import { useQueryState } from "nuqs";

type DateFilter = "today" | "yesterday" | "last-week";

export function ExpensesList() {
    const expenses = useAppSelector(selectAllExpenses);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [dateFilterOption, setDateFilterOption] = useQueryState("date", {
        defaultValue: "today",
        history: "push",
    });

    const isMatchingDateFilter = useCallback(
        (expense: Expense) => {
            const expenseDate = new Date(expense.date);
            const now = new Date();
            switch (dateFilterOption) {
                case "today":
                    return isToday(expenseDate);
                case "yesterday":
                    return isSameDay(expenseDate, addDays(now, -1));
                case "last-week":
                    return isAfter(expenseDate, addWeeks(now, -1));
                default:
                    return true;
            }
        },
        [dateFilterOption],
    );

    const filteredExpenses: Expense[] = useMemo(() => {
        return expenses.filter((e) => isMatchingDateFilter(e));
    }, [expenses, isMatchingDateFilter]);

    function getActiveDateFilter() {
        if (dateFilterOption === "today") {
            return "Heute";
        }
        if (dateFilterOption === "yesterday") {
            return "Gestern";
        }
        if (dateFilterOption === "last-week") {
            return "Letzte Woche";
        }
    }

    return (
        <div
            className={
                "bg-surface-container-lowest m-2 mt-4 flex flex-col rounded-md p-4"
            }
        >
            <Badge
                variant={"md3"}
                className={"flex gap-x-2"}
                onClick={() => {
                    setIsDrawerOpen(true);
                }}
            >
                <div>
                    <Calendar className={"text-primary size-4"} />
                </div>
                <div className={"text-on-surface font-medium"}>
                    {getActiveDateFilter()}
                </div>
            </Badge>

            <div className={"mt-4 flex w-full flex-col"}>
                {filteredExpenses.length === 0 && (
                    <div className={"text-outline mt-2 text-center"}>
                        Keine Ausgaben für {getActiveDateFilter()}
                    </div>
                )}
                {filteredExpenses.map((expense) => (
                    <ExpenseListItem key={expense.id} transaction={expense} />
                ))}
            </div>

            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <DateFilterDrawerContent
                        closeDrawer={() => setIsDrawerOpen(false)}
                        dateFilterOption={dateFilterOption as DateFilter}
                        setDateFilterOption={(df) => setDateFilterOption(df)}
                    />
                </DrawerContent>
            </Drawer>
        </div>
    );
}

type Props = {
    dateFilterOption: DateFilter;
    setDateFilterOption: (option: DateFilter) => void;
    closeDrawer: VoidFunction;
};

const DateFilterDrawerContent: FC<Props> = ({
    setDateFilterOption,
    dateFilterOption,
    closeDrawer,
}) => {
    return (
        <div className={"mx-4"}>
            <div className={"mb-8 flex gap-x-4"}>
                <DrawerClose asChild>
                    <div>
                        <X />
                    </div>
                </DrawerClose>
                <div className={"font-medium"}>Datum</div>
            </div>
            <RadioGroup
                defaultValue={dateFilterOption}
                onValueChange={(e) => {
                    setDateFilterOption(e as typeof dateFilterOption);
                    closeDrawer();
                }}
                className={"mb-6"}
            >
                <div className="mb-3 flex items-center gap-5">
                    <RadioGroupItem value="today" id="today" />
                    <Label htmlFor="today">Heute</Label>
                </div>
                <div className="mb-3 flex items-center gap-5">
                    <RadioGroupItem value="yesterday" id="yesterday" />
                    <Label htmlFor="yesterday">Gestern</Label>
                </div>

                <div className="mb-3 flex items-center gap-5">
                    <RadioGroupItem value="last-week" id="last-week" />
                    <Label htmlFor="last-week">Letzte Woche</Label>
                </div>
            </RadioGroup>
        </div>
    );
};
