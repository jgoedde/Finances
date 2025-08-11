import { isSameMonth, isToday, isYesterday } from "date-fns";
import type { Expense } from "@/persistence/types.ts";

export function getSpentAmountToday(expensesList: Expense[]) {
    const amountsToday = expensesList
        .filter((e) => isToday(e.date))
        .map((e) => e.amount);

    return amountsToday.reduce((acc, amount) => acc + amount, 0);
}

export function getSpentAmountThisMonth(
    expenses: Expense[],
    onlyPositive: boolean = false,
) {
    const amountsThisMonth = expenses
        .filter((e) => isSameMonth(new Date(), e.date))
        .filter((e) => !onlyPositive || e.amount > 0)
        .map((e) => e.amount);

    return amountsThisMonth.reduce((acc, amount) => acc + amount, 0);
}

export function getSpentAmountYesterday(expensesList: Expense[]) {
    const amountsYesterday = expensesList
        .filter((e) => isYesterday(e.date))
        .map((e) => e.amount);

    return amountsYesterday.reduce((acc, amount) => acc + amount, 0);
}

export function getSpentAmountThisMonthInCategory(
    expenses: Expense[],
    categoryName: string,
    onlyPositive = false,
) {
    console.log(
        expenses,
        categoryName,
        onlyPositive,
        "expenses,categoryName,onlyPositive",
    );
    const amountsThisMonth = [1];
    //TODO
    // const amountsThisMonth = expenses
    //     .filter(
    //         (e) =>
    //             isSameMonth(new Date(e.date), new Date()) &&
    //             e.category.name === categoryName,
    //     )
    //     .filter((e) => !onlyPositive || e.amount > 0)
    //     .map((e) => e.amount);

    return amountsThisMonth.reduce((acc, amount) => acc + amount, 0);
}

export function getSpentAmountInMonth(
    expensesList: Expense[],
    month: YearMonth,
    onlyPositive = false,
): number {
    const amountsInMonth = expensesList
        .filter((e) =>
            isSameMonth(
                new Date(e.date),
                new Date(month.year, month.monthIndex),
            ),
        )
        .filter((e) => !onlyPositive || e.amount > 0)
        .map((e) => e.amount);

    return amountsInMonth.reduce((acc, amount) => acc + amount, 0);
}

export function getExpensesInMonth(month: YearMonth, expenses: Expense[]) {
    return expenses.filter((e) =>
        isSameMonth(new Date(e.date), new Date(month.year, month.monthIndex)),
    );
}

interface YearMonth {
    year: number;
    monthIndex: number; // 0 for January, 1 for February, etc.
}
