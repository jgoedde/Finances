import { Drama, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { ExpensesGroup } from "@/components/expenses/history/expenses-group.tsx";
import { NewExpenseFAB } from "@/components/expenses/new-expense-fab.tsx";
import { useEffect, useMemo } from "react";
import { differenceInYears, isToday, isYesterday } from "date-fns";
import { formatEuro } from "@/lib/currency-utils.ts";
import { useAppDispatch, useAppSelector } from "@/redux-hooks.ts";
import {
    expensesSelectors,
    selectSpentThisMonth,
    selectSpentToday,
    selectSpentYesterday,
} from "@/components/expenses/slice.ts";
import { useEncryption } from "@/components/use-encryption.ts";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";
import { useLocation } from "wouter";
import { useRipple } from "@/hooks/use-ripple.ts";
import type { Expense } from "@/components/expense.ts";
import { loadExpenses } from "@/components/expenses/actions.ts";
import { maybeMigrateLocalStorage } from "@/lib/app-local-storage.ts";
import { loadFixedCosts } from "@/components/fixed-costs/actions.ts";
import {
    fixedCostsSelectors,
    setFixedCosts,
} from "@/components/fixed-costs/slice.ts";
import { ExportButton } from "@/components/expenses/export-button.tsx";
import { IncomeDistribution } from "@/components/expenses/income-distribution.tsx";
import { selectIsShowingMore, showMore } from "@/app-slice.ts";
import type { FixedCost } from "@/components/fixed-costs/fixed-cost.ts";

export const ExpensesPage = () => {
    const dispatch = useAppDispatch();

    const [, route] = useLocation();
    const { key } = useEncryption();
    const ripple = useRipple();

    const isDecrypting = useAppSelector((state) => state.app.isDecrypting);
    const isInitial = useAppSelector((state) => state.expenses.isInitial);
    const expenses = useAppSelector(expensesSelectors.selectAll);
    const fixedCosts = useAppSelector(fixedCostsSelectors.selectAll);
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

    const groupedExpenses = useMemo(
        () =>
            expenses.reduce((acc: { [key: string]: Expense[] }, expense) => {
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
            }, {}),
        [expenses],
    );

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
                <div className={"text-on-surface-variant"}>
                    Search for expense
                </div>
            </div>

            <div
                className={
                    "mt-6 flex w-full shrink-0 gap-x-3 overflow-x-auto px-3"
                }
            >
                <Card
                    className={
                        "ripple-container bg-surface-container-highest font-poppins w-[150px] shrink-0 rounded-md border-none shadow-none"
                    }
                    data-ripple-color="bg-on-surface/10"
                    {...ripple}
                    onClick={(e) => {
                        ripple.onClick(e);

                        setTimeout(() => route("/reporting"), 150);
                    }}
                >
                    <CardHeader className={"flex flex-col font-medium"}>
                        <div className={""}>Spent today</div>
                    </CardHeader>
                    <CardContent className={"mt-auto"}>
                        <div className={"font-bold"}>
                            {formatEuro(spentToday)}
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={
                        "ripple-container bg-surface-container-highest font-poppins w-[150px] shrink-0 rounded-md border-none shadow-none"
                    }
                    data-ripple-color="bg-on-surface/10"
                    {...ripple}
                    onClick={(e) => {
                        ripple.onClick(e);
                        setTimeout(() => route("/reporting"), 150);
                    }}
                >
                    <CardHeader className={"flex flex-col font-medium"}>
                        <div>Spent this month</div>
                    </CardHeader>
                    <CardContent className={"mt-auto"}>
                        <div className={"font-bold"}>
                            {formatEuro(spentThisMonth)}
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={
                        "ripple-container bg-surface-container-highest font-poppins w-[150px] shrink-0 rounded-md border-none shadow-none"
                    }
                    data-ripple-color="bg-on-surface/10"
                    {...ripple}
                    onClick={(e) => {
                        ripple.onClick(e);
                        setTimeout(() => route("/reporting"), 150);
                    }}
                >
                    <CardHeader className={"flex flex-col"}>
                        <div className={"font-medium"}>Spent yesterday</div>
                    </CardHeader>
                    <CardContent className={"mt-auto"}>
                        <div className={"font-bold"}>
                            {formatEuro(spentYesterday)}
                        </div>
                    </CardContent>
                </Card>
                {fixedCosts.length === 0 && !isDecrypting && !isInitial && (
                    <Card
                        className={
                            "ripple-container text-on-primary-container bg-primary-container border-outline-variant w-[150px] shrink-0 rounded-md border-2 border-dotted text-center shadow-none"
                        }
                        data-ripple-color="bg-on-surface/10"
                        {...ripple}
                        onClick={(e) => {
                            ripple.onClick(e);
                        }}
                    >
                        <CardHeader className={"my-auto flex flex-col"}>
                            <button
                                className={"font-medium"}
                                onClick={() => {
                                    const fixedCostsJson = prompt(
                                        "Enter stuff as JSON",
                                    );
                                    if (!fixedCostsJson) {
                                        return;
                                    }

                                    dispatch(
                                        setFixedCosts(
                                            JSON.parse(
                                                fixedCostsJson,
                                            ) as FixedCost[],
                                        ),
                                    );
                                }}
                            >
                                Set up <span className={""}>fixed costs</span>
                            </button>
                        </CardHeader>
                    </Card>
                )}
            </div>

            <main className={"grow"}>
                <IncomeDistribution />
                <div className={"flex items-center justify-between px-4"}>
                    <h1
                        className={
                            "text-primary font-poppins mb-4 text-2xl font-bold"
                        }
                    >
                        My expenses
                    </h1>
                    {Object.keys(groupedExpenses).length > 0 && (
                        <ExportButton />
                    )}
                </div>

                {expenses.length === 0 && !isDecrypting && !isInitial && (
                    <div
                        className={
                            "text-on-surface-variant my-6 flex w-full flex-col items-center px-4"
                        }
                    >
                        <Drama className={"size-24"} />
                        <div className={"mt-2"}>No expenses tracked yet</div>
                    </div>
                )}

                {isDecrypting && (
                    <div
                        className={
                            "text-secondary my-5 flex w-full flex-col items-center px-4"
                        }
                    >
                        <div>Loading expenses...</div>
                        <LoadingSpinner />
                    </div>
                )}

                <div className={"flex w-full flex-col gap-y-4"}>
                    {Object.keys(groupedExpenses).map((date, i) => {
                        const initiallyShown = 3;

                        const expenses = groupedExpenses[date];

                        if (i > initiallyShown - 1 && !isShowingMore) {
                            return null;
                        }

                        return (
                            <div key={`${date}-${i}`}>
                                <ExpensesGroup
                                    date={date}
                                    expenses={expenses}
                                />
                                {i === initiallyShown - 1 && !isShowingMore && (
                                    <div className={"flex justify-center"}>
                                        <button
                                            className={"text-primary mt-4"}
                                            onClick={() => {
                                                dispatch(showMore());
                                            }}
                                        >
                                            Show more
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>

            {!isDecrypting && !isInitial && <NewExpenseFAB />}
        </div>
    );
};
