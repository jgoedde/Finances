import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAppSelector } from "@/redux-hooks.ts";
import { selectExpenseById } from "@/components/expenses/slice.ts";
import { ExpenseDetailPage } from "@/components/expenses/editor/expense-detail-page.tsx";

export const Route = createFileRoute("/edit/$id")({
    component: EditExpensePage,
});

function EditExpensePage() {
    const { id } = Route.useParams();
    const navigate = useNavigate();
    const expense = useAppSelector((state) => selectExpenseById(state, id));

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
