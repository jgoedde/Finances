import { formatEuro } from "@/lib/currency-utils.ts";
import { useAppSelector } from "@/redux-hooks.ts";
import { selectAllExpenses } from "@/components/expenses/slice.ts";
import { isAfter, startOfWeek } from "date-fns";
import { selectExpensesInMonth } from "@/components/expenses/selectors.ts";
import { categories } from "@/components/expenses/editor/categories.ts";
import type { Expense } from "@/components/expense.ts";

export const Insights = () => {
    const expenses = useAppSelector(selectAllExpenses);

    const topExpenseThisWeek: Expense | { amount: number; name: string } =
        expenses
            .filter((e) => {
                const startOfThisWeek = startOfWeek(new Date(), {
                    weekStartsOn: 1,
                });

                return (
                    isAfter(new Date(e.date), startOfThisWeek) &&
                    !isAfter(new Date(e.date), new Date())
                );
            })
            .reduce(
                (acc, expense) => {
                    if (expense.amount > acc.amount) {
                        return expense;
                    }
                    return acc;
                },
                { amount: 0, name: "Kein Ausgaben diese Woche" },
            );

    const expensesInCurrentMonth = useAppSelector((state) =>
        selectExpensesInMonth(state, {
            year: new Date().getFullYear(),
            monthIndex: new Date().getMonth(),
        }),
    );

    const expensesEatingOut = expensesInCurrentMonth.filter((e) => {
        return e.category.iconName === categories[0].icon;
    });

    const avgSpentEatingOut =
        expensesEatingOut.reduce((acc, expense) => acc + expense.amount, 0) /
        expensesEatingOut.length;

    const mostSpentWeekdayFormatted: { day: string; amount: number } =
        Object.entries(
            expensesInCurrentMonth.reduce<Record<number, number>>(
                (acc, expense) => {
                    const date = new Date(expense.date);
                    const day = date.getDay();
                    acc[day] = (acc[day] || 0) + expense.amount;
                    return acc;
                },
                {},
            ),
        ).reduce<{ day: string; amount: number }>(
            (acc, [day, amount]) => {
                const dayName = [
                    "Sonntag",
                    "Montag",
                    "Dienstag",
                    "Mittwoch",
                    "Donnerstag",
                    "Freitag",
                    "Samstag",
                ][parseInt(day)];
                if (amount > acc.amount) {
                    return { day: dayName, amount };
                }
                return acc;
            },
            { day: "Kein Tag", amount: 0 },
        );
    const mostExpensiveDayThisYear = expenses.reduce(
        (acc, expense) => {
            const date = new Date(expense.date);
            if (date.getFullYear() === new Date().getFullYear()) {
                if (expense.amount > acc.amount) {
                    return {
                        day: date.toLocaleDateString("de-DE", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        }),
                        amount: expense.amount,
                        expense: expense.name,
                    };
                }
            }
            return acc;
        },
        { day: "Kein Tag", amount: 0, expense: "Keine" },
    );

    // --- Advanced Insights ---
    // 1. Unusual Spending Detection
    // Calculate average spend per category across all months
    const categorySpendTotals: Record<string, number[]> = {};
    expenses.forEach((e) => {
        const cat = e.category.name;
        if (!categorySpendTotals[cat]) categorySpendTotals[cat] = [];
        categorySpendTotals[cat].push(e.amount);
    });
    const categoryAverages: Record<string, number> = {};
    Object.entries(categorySpendTotals).forEach(([cat, amounts]) => {
        categoryAverages[cat] =
            amounts.reduce((a, b) => a + b, 0) / amounts.length;
    });
    // This month's spend per category
    const currentMonthCategoryTotals: Record<string, number> = {};
    expensesInCurrentMonth.forEach((e) => {
        const cat = e.category.name;
        currentMonthCategoryTotals[cat] =
            (currentMonthCategoryTotals[cat] || 0) + e.amount;
    });
    // Find categories with unusually high spend
    const unusualCategories = Object.entries(currentMonthCategoryTotals)
        .filter(
            ([cat, total]) =>
                categoryAverages[cat] && total > categoryAverages[cat] * 1.5,
        )
        .map(([cat, total]) => ({
            name: cat,
            total,
            avg: categoryAverages[cat],
        }));

    // 2. Recurring Expense Patterns
    // Find expenses with same name+category in multiple months
    const recurringMap: Record<
        string,
        { name: string; category: string; count: number }
    > = {};
    expenses.forEach((e) => {
        const key = `${e.name}|${e.category.name}`;
        if (!recurringMap[key]) {
            recurringMap[key] = {
                name: e.name,
                category: e.category.name,
                count: 0,
            };
        }
        recurringMap[key].count += 1;
    });
    const recurringExpenses = Object.values(recurringMap)
        .filter((r) => r.count >= 3)
        .slice(0, 5);

    return (
        <div className={"mt-8 mb-8 flex w-full flex-wrap gap-y-2 px-4"}>
            {/*<pre>*/}
            {/*    {JSON.stringify(spendingHoursMap, null, 2)}*/}
            {/*</pre>*/}
            {topExpenseThisWeek.amount > 0 && (
                <div
                    className={
                        "bg-surface-container-low flex w-1/2 flex-col gap-y-1 rounded-sm p-2 text-center"
                    }
                >
                    <div>Teuerstes diese Woche</div>
                    <div className={"font-poppins font-semibold"}>
                        {topExpenseThisWeek.name},{" "}
                        {formatEuro(topExpenseThisWeek.amount)}
                    </div>
                </div>
            )}
            <div
                className={
                    "bg-surface-container-low flex w-1/2 flex-col gap-y-1 rounded-sm p-2 text-center"
                }
            >
                <div>
                    <span className={"font-poppins font-semibold"}>
                        {expensesEatingOut.length}
                    </span>{" "}
                    mal auswärts gegessen
                </div>
                <div className={"font-poppins font-semibold"}>
                    {formatEuro(avgSpentEatingOut)}
                </div>
            </div>
            <div
                className={
                    "bg-surface-container-low flex w-1/2 flex-col gap-y-1 rounded-sm p-2 text-center"
                }
            >
                <div>
                    Meiste Ausgaben im{" "}
                    {new Date().toLocaleDateString("de-DE", { month: "long" })}
                </div>
                <div className={"font-poppins font-semibold"}>
                    {mostSpentWeekdayFormatted.day}s
                </div>
            </div>
            <div
                className={
                    "bg-surface-container-low flex w-1/2 flex-col gap-y-1 rounded-sm p-2 text-center"
                }
            >
                <div>Teuerster Tag {new Date().getFullYear()}</div>
                <div className={"font-poppins font-semibold"}>
                    {mostExpensiveDayThisYear.day},{" "}
                    {mostExpensiveDayThisYear.expense},{" "}
                    {formatEuro(mostExpensiveDayThisYear.amount)}
                </div>
            </div>
            <div
                className={
                    "bg-surface-container-low flex w-1/2 flex-col gap-y-1 rounded-sm p-2 text-center"
                }
            >
                <div>Ungewöhnlich hohe Ausgaben</div>
                {unusualCategories.length === 0 ? (
                    <div className={"font-poppins font-semibold"}>
                        Keine auffälligen Kategorien
                    </div>
                ) : (
                    unusualCategories.map((cat) => (
                        <div
                            key={cat.name}
                            className={"font-poppins text-error font-semibold"}
                        >
                            {cat.name}: {formatEuro(cat.total)}
                        </div>
                    ))
                )}
            </div>
            <div
                className={
                    "bg-surface-container-low flex w-1/2 flex-col gap-y-1 rounded-sm p-2 text-center"
                }
            >
                <div>Wiederkehrende Ausgaben</div>
                {recurringExpenses.length === 0 ? (
                    <div className={"font-poppins font-semibold"}>
                        Keine gefunden
                    </div>
                ) : (
                    recurringExpenses.map((r) => (
                        <div
                            key={r.name + r.category}
                            className={"font-poppins font-semibold"}
                        >
                            {r.name} – {r.count}x
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
