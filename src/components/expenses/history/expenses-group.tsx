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
        <div className={"flex flex-col py-1"}>
            <div
                className={
                    "text-on-surface-variant/80 mb-1 px-4 text-sm font-medium"
                }
            >
                {date}
            </div>
            <div className={"flex flex-col gap-y-1.5"}>
                {expenses.map((expense) => (
                    <ExpenseListItem key={expense.id} transaction={expense} />
                ))}
            </div>
        </div>
    );
};
