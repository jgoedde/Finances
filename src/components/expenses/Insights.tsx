import { formatEuro } from "@/lib/currency-utils.ts";
import { useAppSelector } from "@/redux-hooks.ts";
import { expensesSelectors } from "@/components/expenses/slice.ts";
import { isAfter, startOfWeek } from "date-fns";
import { selectExpensesInMonth } from "@/components/expenses/selectors.ts";
import { categories } from "@/components/expenses/editor/categories.ts";
import type { Expense } from "@/components/expense.ts";

export const Insights = () => {
    const expenses = useAppSelector(expensesSelectors.selectAll);

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

    const avgWeekendSpent =
        expenses
            .filter((e) => {
                const date = new Date(e.date);
                return date.getDay() === 0 || date.getDay() === 6;
            })
            .reduce((acc, expense) => acc + expense.amount, 0) / 2;

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
                <div>Durschnitt Wochenende</div>
                <div className={"font-poppins font-semibold"}>
                    {formatEuro(avgWeekendSpent)}
                </div>
            </div>
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
        </div>
    );
};
