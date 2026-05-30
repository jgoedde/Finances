import { createFileRoute } from "@tanstack/react-router";
import { TransactionDetailPage } from "@/components/transactions/editor/transaction-detail-page.tsx";
import { z } from "zod";

const prefilledSchema = z.object({
    vendor: z.string().nonempty().optional().catch(undefined),
    amount: z.number().optional().catch(undefined),
});

export const Route = createFileRoute("/new")({
    component: TransactionDetailPage,
    validateSearch: prefilledSchema,
});
