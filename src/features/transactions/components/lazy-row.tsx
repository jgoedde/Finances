import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { Calendar, Clock, History } from "lucide-react";
import { formatEuro } from "@/utils/currency.ts";
import type { ReactNode } from "react";
import { useSpentByTimeRange } from "@/features/transactions/use-transactions.ts";
import {
    addDays,
    endOfDay,
    endOfMonth,
    startOfDay,
    startOfMonth,
} from "date-fns";

const now = new Date();

export function LazyRow() {
    const spentThisMonth = useSpentByTimeRange({
        start: startOfMonth(now),
        end: endOfMonth(now),
        onlyPositive: true,
    });
    const spentToday = useSpentByTimeRange({
        start: startOfDay(now),
        end: endOfDay(now),
        onlyPositive: true,
    });
    const spentYesterday = useSpentByTimeRange({
        start: startOfDay(addDays(now, -1)),
        end: endOfDay(addDays(now, -1)),
        onlyPositive: true,
    });

    return (
        <div
            className={`mt-6 flex w-full shrink-0 gap-x-4 overflow-x-auto px-4
                pb-4 md:grid md:grid-cols-3`}
        >
            <StatCard
                icon={<Clock />}
                label={"Heute ausgegeben"}
                amount={spentToday}
            />
            <StatCard
                icon={<Calendar />}
                label={"Diesen Monat ausgegeben"}
                amount={spentThisMonth}
            />
            <StatCard
                icon={<History />}
                label={"Gestern ausgegeben"}
                amount={spentYesterday}
            />
        </div>
    );
}

function StatCard({
    icon,
    label,
    amount,
}: {
    icon: ReactNode;
    label: string;
    amount: number;
}) {
    return (
        <Card
            variant={"elevated"}
            className={"w-[150px] shrink-0 gap-4 py-4 md:w-auto"}
        >
            <CardHeader className={"flex flex-col items-center px-4"}>
                <div className={"text-on-surface-variant [&>svg]:size-6"}>
                    {icon}
                </div>
                <div className={"text-body-medium text-on-surface text-center"}>
                    {label}
                </div>
            </CardHeader>
            <CardContent className={"mt-auto flex justify-center px-4"}>
                <div className={"font-brand text-title-large text-on-surface"}>
                    {formatEuro(amount)}
                </div>
            </CardContent>
        </Card>
    );
}
