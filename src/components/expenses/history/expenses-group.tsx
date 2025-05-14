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
        <div className={"bg-surface-container-low flex flex-col rounded py-3"}>
            <div className={"text-on-surface-variant mb-1 px-4 text-sm"}>
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
