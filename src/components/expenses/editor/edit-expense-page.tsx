import type { FC } from "react";
import { useAppSelector } from "@/hooks.ts";
import { expensesSelectors } from "@/components/expenses/slice.ts";
import { Redirect } from "wouter";
import { ExpenseDetail } from "@/components/expenses/editor/expense-detail.tsx";

export const EditExpensePage: FC<{ id: string }> = ({ id }) => {
    const expense = useAppSelector((state) =>
        expensesSelectors.selectById(state, id),
    );

    if (!expense) {
        return <Redirect to={"/"} />;
    }

    return (
        <ExpenseDetail
            id={id}
            name={expense.name}
            amount={expense.amount}
            date={new Date(expense.date)}
            category={expense.category}
            description={expense.description}
        />
    );
};
