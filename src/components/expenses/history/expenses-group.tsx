import { ExpenseListItem } from "@/components/expenses/history/expense-list-item.tsx";
import type { Expense } from "@/components/use-expenses.ts";

export const ExpensesGroup = ({
    date,
    expenses,
}: {
    date: string;
    expenses: Expense[];
}) => {
    return (
        <div className={"flex flex-col"}>
            <div className={"text-on-surface-variant mb-1"}>{date}</div>
            <div className={"flex flex-col gap-y-1.5"}>
                {expenses.map((expense) => (
                    <ExpenseListItem key={expense.id} transaction={expense} />
                ))}
            </div>
        </div>
    );
};
