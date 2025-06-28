import { ArrowUp, Calendar, Clock, History, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { NewExpenseFAB } from "@/components/expenses/new-expense-fab.tsx";
import { useEffect } from "react";
import {
    differenceInYears,
    isFuture,
    isPast,
    isToday,
    isYesterday,
} from "date-fns";
import { formatEuro } from "@/lib/currency-utils.ts";
import { useAppDispatch, useAppSelector } from "@/redux-hooks.ts";
import { expensesSelectors } from "@/components/expenses/slice.ts";
import { useEncryption } from "@/components/use-encryption.ts";
import { useLocation } from "wouter";
import { useRipple } from "@/hooks/use-ripple.ts";
import type { Expense } from "@/components/expense.ts";
import { loadExpenses } from "@/components/expenses/actions.ts";
import { maybeMigrateLocalStorage } from "@/lib/app-local-storage.ts";
import { loadFixedCosts } from "@/components/fixed-costs/actions.ts";
import { selectIsShowingMore } from "@/app-slice.ts";
import { setFixedCosts } from "@/components/fixed-costs/slice.ts";
import type { FixedCost } from "@/components/fixed-costs/fixed-cost.ts";
import { categories } from "@/components/expenses/editor/categories.ts";
import { MonthlyCategoryRow } from "@/components/expenses/monthly-category-row.tsx";
import {
    selectSpentThisMonth,
    selectSpentToday,
    selectSpentYesterday,
} from "@/components/expenses/selectors.ts";

export const ExpensesPage = () => {
    const dispatch = useAppDispatch();

    const [, route] = useLocation();
    const { key } = useEncryption();
    const ripple = useRipple();

    const isDecrypting = useAppSelector((state) => state.app.isDecrypting);
    const isInitial = useAppSelector((state) => state.expenses.isInitial);
    const expenses = useAppSelector(expensesSelectors.selectAll);
    const upcomingExpenses = expenses.filter((e) => isFuture(e.date));
    const pastExpenses = expenses.filter((e) => isPast(e.date));
    const isShowingMore = useAppSelector(selectIsShowingMore);

    useEffect(() => {
        if (!key || expenses.length > 0) {
            return;
        }

        (async () => {
            await maybeMigrateLocalStorage({ key });
            dispatch(loadExpenses({ key }));
            dispatch(loadFixedCosts({ key }));
        })();
    }, [dispatch, expenses.length, key]);

    function getGroupedExpenses() {
        return pastExpenses.reduce(
            (acc: { [key: string]: Expense[] }, expense) => {
                let dateFormatted: string;
                if (isToday(expense.date)) {
                    dateFormatted = "Heute";
                } else if (isYesterday(expense.date)) {
                    dateFormatted = "Gestern";
                } else {
                    dateFormatted = new Date(expense.date).toLocaleDateString(
                        "de-DE",
                        {
                            ...(differenceInYears(new Date(), expense.date) >=
                                1 && { year: "numeric" }),
                            month: "long",
                            day: "2-digit",
                        },
                    );
                }

                if (!acc[dateFormatted]) {
                    acc[dateFormatted] = [];
                }
                acc[dateFormatted].push(expense);
                return acc;
            },
            {},
        );
    }

    const groupedExpenses = getGroupedExpenses();

    const spentThisMonth = useAppSelector(selectSpentThisMonth);
    const spentToday = useAppSelector(selectSpentToday);
    const spentYesterday = useAppSelector(selectSpentYesterday);

    return (
        <div className={"relative container mx-auto flex h-dvh flex-col"}>
            <div
                className={
                    "bg-surface-container-high mx-auto mt-3 flex h-14 w-7/8 shrink-0 content-center items-center rounded-full"
                }
            >
                <div className={"px-4"}>
                    <Search className={"text-on-surface size-6"} />
                </div>
                <div
                    className={"text-on-surface-variant"}
                    onClick={() => {
                        route("/expenses/search");
                    }}
                >
                    Search for expense
                </div>
            </div>

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
                            const fixedCostsJson = prompt(
                                "Enter stuff as JSON",
                            );
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

            <main className={"grow"}>
                <Card
                    className={
                        "bg-surface-container-highest text-on-surface m-2 flex rounded-md border-none px-4 py-6"
                    }
                >
                    <div className={"text-md"}>
                        <div
                            className={
                                "bg-surface-bright flex flex-wrap items-center rounded-sm p-2"
                            }
                        >
                            <div>Du hast diesen Monat</div>
                            <div
                                className={"text-error mx-1 flex items-center"}
                            >
                                <ArrowUp className={"size-4"} /> 12% mehr
                            </div>
                            <div className={""}>
                                für Einkäufe ausgegeben als im Mai.
                            </div>
                        </div>
                    </div>
                    <div className={"mt-2 flex flex-col gap-y-3"}>
                        {categories.map((category) => (
                            <MonthlyCategoryRow
                                category={category}
                                key={category.icon}
                            />
                        ))}
                    </div>
                </Card>
            </main>

            {!isDecrypting && !isInitial && <NewExpenseFAB />}
        </div>
    );
};
