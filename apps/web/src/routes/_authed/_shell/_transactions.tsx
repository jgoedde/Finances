import {
    createFileRoute,
    Outlet,
    retainSearchParams,
} from "@tanstack/react-router";
import { z } from "zod";
import { DATE_FILTER_OPTIONS } from "#/features/search/filters/date/date-filter.ts";
import { useIsDetailOpen } from "#/features/navigation/use-is-detail-open.ts";
import { TransactionsView } from "#/features/transactions/components/list/transactions-view.tsx";
import { cn } from "#/lib/cn.ts";

const transactionsSearchSchema = z.object({
    /**
     * Only this category's transactions of the month.
     */
    category: z.string().min(1).optional().catch(undefined),
    /**
     * Search term; searches all months instead of the selected one.
     */
    q: z.string().optional().catch(undefined),
    older: z.enum(DATE_FILTER_OPTIONS).optional().catch(undefined),
});

// The transaction list with its detail routes (new, edit). On expanded
// windows the detail opens in a pane beside the list; otherwise it
// replaces the list. Filters stay while a detail is open.
export const Route = createFileRoute("/_authed/_shell/_transactions")({
    validateSearch: transactionsSearchSchema,
    search: { middlewares: [retainSearchParams(["category", "q", "older"])] },
    component: RouteComponent,
});

function RouteComponent() {
    const isDetailOpen = useIsDetailOpen();

    return (
        <div className={"expanded:flex"}>
            <div
                className={cn(
                    "min-w-0 grow",
                    isDetailOpen && "hidden expanded:block",
                )}
            >
                <TransactionsView />
            </div>
            {isDetailOpen && (
                <div
                    className={`expanded:sticky expanded:top-0 expanded:h-dvh
                    expanded:w-[min(32rem,50%)] expanded:shrink-0
                    expanded:overflow-y-auto expanded:border-l
                    expanded:border-outline-variant`}
                >
                    <Outlet />
                </div>
            )}
        </div>
    );
}
