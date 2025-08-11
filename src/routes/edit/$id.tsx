import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExpenseDetailPage } from "@/components/expenses/editor/expense-detail-page.tsx";
import { useExpense } from "@/components/expenses/use-expense.ts";

export const Route = createFileRoute("/edit/$id")({
    component: EditExpensePage,
});

function EditExpensePage() {
    const { id } = Route.useParams();
    const navigate = useNavigate();
    const expense = useExpense(id, {
        includeCategory: true,
    });

    if (!expense) {
        void navigate({ to: "/" });
        return null;
    }

    return <ExpenseDetailPage expense={expense} />;
}
