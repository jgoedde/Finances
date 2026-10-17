import { useMemo } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer.tsx";
import { Calendar, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import { addDays, endOfDay, startOfDay } from "date-fns";
import { Badge } from "@/components/ui/badge.tsx";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useTransactions } from "@/features/transactions/use-transactions.ts";
import { groupBy } from "lodash";
import type { Transaction } from "@/persistence/types.ts";
import { TransactionListItem } from "@/features/transactions/components/list/transaction-list-item.tsx";

type DateFilter = "today" | "yesterday" | "last-7-days";

const now = new Date();

export function TransactionList() {
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
        } else if (dateFilterOption === "last-7-days") {
            return {
                start: addDays(now, -7),
                end: endOfDay(now),
            };
        } else {
            return todayFilter;
        }
    }, [dateFilterOption]);

    const transactions = useTransactions(queryOptions);

    const [isDrawerOpen, setIsDrawerOpen] = useQueryState(
        "date-drawer",
        parseAsBoolean.withDefault(false).withOptions({ history: "replace" }),
    );

    function getActiveDateFilter() {
        if (dateFilterOption === "today") {
            return "Heute";
        }
        if (dateFilterOption === "yesterday") {
            return "Gestern";
        }
        if (dateFilterOption === "last-7-days") {
            return "Letzte 7 Tage";
        }
    }

    const grouped: Record<string, Transaction[]> = groupBy(transactions, (e) =>
        new Date(e.date).toLocaleDateString("de-DE", {
            weekday: "short",
            day: "2-digit",
            month: "long",
        }),
    );

    return (
        <Drawer
            open={isDrawerOpen}
            onOpenChange={(o) => void setIsDrawerOpen(o)}
        >
            <Card className={"m-2 mt-4 gap-0 px-2 py-4"}>
                <DrawerTrigger asChild>
                    <Badge
                        asChild
                        variant={"md3"}
                        className={"ml-2"}
                        onClick={() => {
                            void setIsDrawerOpen(true);
                        }}
                    >
                        <button type={"button"}>
                            <Calendar className={"text-primary"} />
                            <span className={"text-on-surface"}>
                                {getActiveDateFilter()}
                            </span>
                            <ChevronDown />
                        </button>
                    </Badge>
                </DrawerTrigger>

                <div className={"mt-4 flex w-full flex-col"}>
                    {transactions.length === 0 && (
                        <div
                            className={`text-on-surface-variant text-body-medium
                            mt-2 text-center`}
                        >
                            Keine Geldbewegungen für {getActiveDateFilter()}
                        </div>
                    )}
                    {dateFilterOption === "last-7-days"
                        ? Object.keys(grouped).map((day) => (
                              <TransactionGroup
                                  key={day}
                                  day={day}
                                  transactions={grouped[day] ?? []}
                              />
                          ))
                        : transactions.map((it) => (
                              <TransactionListItem
                                  key={it.id}
                                  transaction={it}
                              />
                          ))}
                </div>
            </Card>
            <DrawerContent>
                <DrawerHeader className={"pt-0 text-left"}>
                    <DrawerTitle>Zeitraum</DrawerTitle>
                    <DrawerDescription className={"sr-only"}>
                        Zeitraum der angezeigten Geldbewegungen wählen
                    </DrawerDescription>
                </DrawerHeader>
                <DateFilterDrawerContent
                    closeDrawer={() => void setIsDrawerOpen(false)}
                    dateFilterOption={dateFilterOption as DateFilter}
                    setDateFilterOption={(df) => setDateFilterOption(df)}
                />
            </DrawerContent>
        </Drawer>
    );
}

interface Props {
    dateFilterOption: DateFilter;
    setDateFilterOption: (option: DateFilter) => void;
    closeDrawer: VoidFunction;
}

function DateFilterDrawerContent({
    setDateFilterOption,
    dateFilterOption,
    closeDrawer,
}: Props) {
    return (
        <RadioGroup
            defaultValue={dateFilterOption}
            onValueChange={(e) => {
                setDateFilterOption(e as typeof dateFilterOption);
                closeDrawer();
            }}
            className={"mb-6 gap-0"}
        >
            {(
                [
                    ["today", "Heute"],
                    ["yesterday", "Gestern"],
                    ["last-7-days", "Letzte 7 Tage"],
                ] as const
            ).map(([value, label]) => (
                <Label
                    key={value}
                    htmlFor={value}
                    className={`state-layer text-body-large text-on-surface flex
                    min-h-14 cursor-pointer items-center gap-4 px-4`}
                >
                    <RadioGroupItem value={value} id={value} />
                    {label}
                </Label>
            ))}
        </RadioGroup>
    );
}

function TransactionGroup({
    day,
    transactions,
}: {
    day: string;
    transactions: Transaction[];
}) {
    return (
        <div className={"mb-3 flex flex-col py-1"}>
            <div
                className={"text-on-surface-variant text-title-small mb-1 px-2"}
            >
                {day}
            </div>
            <div className={"flex flex-col gap-y-1.5"}>
                {transactions.map((it) => (
                    <TransactionListItem key={it.id} transaction={it} />
                ))}
            </div>
        </div>
    );
}
