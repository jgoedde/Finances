import { createFileRoute } from "@tanstack/react-router";
import { TransactionDetailPage } from "@/components/transactions/editor/transaction-detail-page.tsx";

export const Route = createFileRoute("/new")({
    component: TransactionDetailPage,
});
