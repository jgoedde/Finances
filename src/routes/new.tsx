import { createFileRoute } from "@tanstack/react-router";
import { ExpenseDetailPage } from "@/components/expenses/editor/expense-detail-page.tsx";

export const Route = createFileRoute("/new")({
    component: ExpenseDetailPage,
});
