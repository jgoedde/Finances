import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { Calendar, Clock, History } from "lucide-react";
import { formatEuro } from "@/lib/currency-utils.ts";
import { setFixedCosts } from "@/components/fixed-costs/slice.ts";
import type { FixedCost } from "@/components/fixed-costs/fixed-cost.ts";
import { useRipple } from "@/hooks/use-ripple.ts";
import { useAppDispatch, useAppSelector } from "@/redux-hooks.ts";
import {
    selectSpentInMonth,
    selectSpentToday,
    selectSpentYesterday,
} from "@/components/expenses/selectors.ts";

export function LazyRow() {
    const dispatch = useAppDispatch();

    const ripple = useRipple();

    const spentThisMonth = useAppSelector((state) =>
        selectSpentInMonth(state, new Date()),
    );
    const spentToday = useAppSelector(selectSpentToday);
    const spentYesterday = useAppSelector(selectSpentYesterday);

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
                onClick={(e) => {
                    ripple.onClick(e);

                    setTimeout(() => {
                        const fixedCostsJson = prompt("Enter stuff as JSON");
                        if (!fixedCostsJson) {
                            return;
                        }

                        dispatch(
                            setFixedCosts(
                                JSON.parse(fixedCostsJson) as FixedCost[],
                            ),
                        );
                    }, 150);
                }}
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
