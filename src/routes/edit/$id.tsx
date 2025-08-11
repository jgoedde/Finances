import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExpenseDetailPage } from "@/components/expenses/editor/expense-detail-page.tsx";
import { useExpense } from "@/components/expenses/use-expense.ts";
import { categories } from "@/components/expenses/editor/categories.ts";

export const Route = createFileRoute("/edit/$id")({
    component: EditExpensePage,
});

function EditExpensePage() {
    const { id } = Route.useParams();
    const navigate = useNavigate();
    const expense = useExpense(id);

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
            category={categories[0]} // TODO: Replace with actual category selection
            description={expense.description}
        />
    );
}
