import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TransactionDetailPage } from "@/components/transactions/editor/transaction-detail-page.tsx";
import { useTransaction } from "@/components/transactions/use-transaction.ts";

export const Route = createFileRoute("/edit/$id")({
    component: EditTransactionPage,
});

function EditTransactionPage() {
    const { id } = Route.useParams();
    const navigate = useNavigate();
    const transaction = useTransaction(id, {
        includeCategory: true,
    });

    if (!transaction) {
        void navigate({ to: "/" });
        return null;
    }

    return <TransactionDetailPage transaction={transaction} />;
}
