import { useMemo } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "#/components/ui/drawer.tsx";
import { Calendar, ChevronDown } from "lucide-react";
import { Card } from "#/components/ui/card.tsx";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group.tsx";
import { Label } from "#/components/ui/label.tsx";
import { addDays, endOfDay, startOfDay } from "date-fns";
import { Badge } from "#/components/ui/badge.tsx";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useTransactions } from "#/features/transactions/transaction-queries.ts";
import { groupBy } from "lodash";
import type { Transaction } from "@finances/shared";
import { TransactionListItem } from "#/features/transactions/components/list/transaction-list-item.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

type DateFilter = "today" | "yesterday" | "last-7-days";

const DATE_FILTER_LABELS = {
    today: m.period_today,
    yesterday: m.period_yesterday,
    "last-7-days": m.period_last_7_days,
} as const satisfies Record<DateFilter, () => string>;

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
        return Object.prototype.hasOwnProperty.call(
            DATE_FILTER_LABELS,
            dateFilterOption,
        )
            ? DATE_FILTER_LABELS[dateFilterOption as DateFilter]()
            : undefined;
    }

    const grouped: Record<string, Transaction[]> = groupBy(transactions, (e) =>
        new Date(e.date).toLocaleDateString(getLocale(), {
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
                            className={`mt-2 text-center text-body-medium
                            text-on-surface-variant`}
                        >
                            {m.transaction_list_empty({
                                period: getActiveDateFilter() ?? "",
                            })}
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
                    <DrawerTitle>{m.period()}</DrawerTitle>
                    <DrawerDescription className={"sr-only"}>
                        {m.period_choose_list()}
                    </DrawerDescription>
                </DrawerHeader>
                <DateFilterDrawerContent
                    closeDrawer={() => void setIsDrawerOpen(false)}
                    dateFilterOption={dateFilterOption as DateFilter}
                    setDateFilterOption={(df) => void setDateFilterOption(df)}
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
            {Object.entries(DATE_FILTER_LABELS).map(([value, label]) => (
                <Label
                    key={value}
                    htmlFor={value}
                    className={`state-layer flex min-h-14 cursor-pointer
                    items-center gap-4 px-4 text-body-large text-on-surface`}
                >
                    <RadioGroupItem value={value} id={value} />
                    {label()}
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
                className={"mb-1 px-2 text-title-small text-on-surface-variant"}
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
