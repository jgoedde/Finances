import { createFileRoute, Outlet } from "@tanstack/react-router";
import { FixedCostsView } from "#/features/fixed-costs/list/fixed-costs-view.tsx";
import { useIsDetailOpen } from "#/features/navigation/use-is-detail-open.ts";
import { cn } from "#/lib/cn.ts";

// The fixed-cost list with its detail routes (new, edit). On expanded
// windows the detail opens in a pane beside the list; otherwise it
// replaces the list.
export const Route = createFileRoute("/_authed/_shell/fixed-costs")({
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
                <FixedCostsView />
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
