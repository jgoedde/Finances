import { type FC, useMemo, useState } from "react";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer.tsx";
import { Calendar, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
    addDays,
    addWeeks,
    endOfDay,
    endOfWeek,
    startOfDay,
    startOfWeek,
} from "date-fns";
import { Badge } from "@/components/ui/badge.tsx";
import { ExpenseListItem } from "@/components/expenses/history/expense-list-item.tsx";
import { useQueryState } from "nuqs";
import { useExpensesByTimeRange } from "@/components/expenses/use-expenses.ts";

type DateFilter = "today" | "yesterday" | "last-week";

const now = new Date();

export function ExpensesList() {
    const [dateFilterOption, setDateFilterOption] = useQueryState("date", {
        defaultValue: "today",
        history: "push",
    });

    const queryOptions: { start: Date; end: Date } = useMemo(() => {
        const todayFilter = {
            start: startOfDay(now),
            end: endOfDay(now),
        };

        if (dateFilterOption === "today") {
            return todayFilter;
        } else if (dateFilterOption === "yesterday") {
            const yesterday = addDays(now, -1);
            return {
                start: startOfDay(yesterday),
                end: endOfDay(yesterday),
            };
        } else if (dateFilterOption === "last-week") {
            const lastWeek = addWeeks(now, -1);
            return {
                start: startOfWeek(lastWeek),
                end: endOfWeek(lastWeek),
            };
        } else {
            return todayFilter;
        }
    }, [dateFilterOption]);

    const expenses = useExpensesByTimeRange(queryOptions);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
                {expenses.length === 0 && (
                    <div className={"text-outline mt-2 text-center"}>
                        Keine Ausgaben für {getActiveDateFilter()}
                    </div>
                )}
                {expenses.map((expense) => (
                    <ExpenseListItem key={expense.id} expense={expense} />
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
