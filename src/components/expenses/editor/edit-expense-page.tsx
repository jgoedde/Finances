import type { FC } from "react";
import { useAppSelector } from "@/redux-hooks.ts";
import { selectExpenseById } from "@/components/expenses/slice.ts";
import { Redirect } from "wouter";
import { ExpenseDetailPage } from "@/components/expenses/editor/expense-detail-page.tsx";

export const EditExpensePage: FC<{ id: string }> = ({ id }) => {
    const expense = useAppSelector((state) => selectExpenseById(state, id));

    if (!expense) {
        return <Redirect to={"/"} />;
    }

    return (
        <ExpenseDetailPage
            id={id}
            name={expense.name}
            amount={expense.amount}
            date={new Date(expense.date)}
            category={expense.category}
            description={expense.description}
        />
    );
};
