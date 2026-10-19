import { Skeleton } from "#/components/ui/skeleton.tsx";
import { m } from "#/paraglide/messages.js";

const ROWS = 6;

/**
 * Placeholder rows shaped like `TransactionListItem` while a month loads.
 */
export function TransactionListSkeleton() {
    return (
        <div
            className={"flex flex-col gap-y-1.5 px-2 pt-2"}
            role={"status"}
            aria-label={m.transaction_list_loading()}
        >
            {Array.from({ length: ROWS }, (_, index) => (
                <div
                    key={index}
                    className={"flex min-h-14 items-center gap-x-4 px-2 py-2"}
                >
                    <Skeleton className={"size-10 shrink-0 rounded-full"} />
                    <div className={"flex flex-1 flex-col gap-y-2"}>
                        <Skeleton className={"h-4 w-2/5"} />
                        <Skeleton className={"h-3.5 w-1/4"} />
                    </div>
                    <Skeleton className={"h-4 w-14 shrink-0"} />
                </div>
            ))}
        </div>
    );
}
