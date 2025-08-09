import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExpenseDetailPage } from "@/components/expenses/editor/expense-detail-page.tsx";
import { useExpenses } from "@/hooks/use-expenses.ts";

export const Route = createFileRoute("/edit/$id")({
    component: EditExpensePage,
});

function EditExpensePage() {
    const { id } = Route.useParams();
    const navigate = useNavigate();
    const { data: expenses } = useExpenses();
    const expense = expenses?.find((e) => e.id === id);

    if (!expense) {
        void navigate({ to: "/" });
        return null;
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
}
