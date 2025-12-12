import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { Calendar, Clock, History } from "lucide-react";
import { formatEuro } from "@/lib/currency-utils.ts";
import { useRipple } from "@/hooks/use-ripple.ts";
import { useSpentByTimeRange } from "@/components/expenses/use-expenses.ts";
import {
    addDays,
    endOfDay,
    endOfMonth,
    startOfDay,
    startOfMonth,
} from "date-fns";

const now = new Date();

export function LazyRow() {
    const ripple = useRipple();

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
            className={
                "mt-6 flex w-full shrink-0 gap-x-6 overflow-x-auto px-4 pb-4"
            }
        >
            <Card
                className={
                    "ripple-container bg-surface-container-low w-[150px] shrink-0 rounded-md border-none drop-shadow-lg"
                }
                data-ripple-color="bg-on-surface/10"
                {...ripple}
            >
                <CardHeader className={"flex flex-col items-center"}>
                    <div className={"text-outline"}>
                        <Clock className={"size-7"} />
                    </div>
                    <div className={"text-on-surface text-center"}>
                        Heute ausgegeben
                    </div>
                </CardHeader>
                <CardContent className={"mt-auto flex justify-center"}>
                    <div
                        className={
                            "font-poppins text-on-surface text-lg font-semibold"
                        }
                    >
                        {formatEuro(spentToday)}
                    </div>
                </CardContent>
            </Card>

            <Card
                className={
                    "ripple-container bg-surface-container-low w-[150px] shrink-0 rounded-md border-none drop-shadow-lg"
                }
                data-ripple-color="bg-on-surface/10"
                {...ripple}
            >
                <CardHeader className={"flex flex-col items-center"}>
                    <div className={"text-outline"}>
                        <Calendar className={"size-7"} />
                    </div>
                    <div className={"text-on-surface text-center"}>
                        Diesen Monat ausgegeben
                    </div>
                </CardHeader>
                <CardContent className={"mt-auto flex justify-center"}>
                    <div
                        className={
                            "font-poppins text-on-surface text-lg font-semibold"
                        }
                    >
                        {formatEuro(spentThisMonth)}
                    </div>
                </CardContent>
            </Card>

            <Card
                className={
                    "ripple-container bg-surface-container-low w-[150px] shrink-0 rounded-md border-none drop-shadow-lg"
                }
                data-ripple-color="bg-on-surface/10"
                {...ripple}
            >
                <CardHeader className={"flex flex-col items-center"}>
                    <div className={"text-outline"}>
                        <History className={"size-7"} />
                    </div>
                    <div className={"text-on-surface text-center"}>
                        Gestern ausgegeben
                    </div>
                </CardHeader>
                <CardContent className={"mt-auto flex justify-center"}>
                    <div
                        className={
                            "font-poppins text-on-surface text-lg font-semibold"
                        }
                    >
                        {formatEuro(spentYesterday)}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
