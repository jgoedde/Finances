import {
    createFileRoute,
    Outlet,
    retainSearchParams,
} from "@tanstack/react-router";
import { monthSearchSchema } from "#/features/month/month.ts";
import { AppNavigation } from "#/features/navigation/app-navigation.tsx";
import { useIsDetailOpen } from "#/features/navigation/use-is-detail-open.ts";
import { cn } from "#/lib/cn.ts";

// The destinations with their navigation. The selected month carries over
// when switching between them.
export const Route = createFileRoute("/_authed/_shell")({
    validateSearch: monthSearchSchema,
    search: { middlewares: [retainSearchParams(["month"])] },
    component: RouteComponent,
});

function RouteComponent() {
    // Below expanded, a detail is full-screen without navigation.
    const isDetailOpen = useIsDetailOpen();

    return (
        <div className={"medium:flex"}>
            <AppNavigation isDetailOpen={isDetailOpen} />
            <div
                className={cn(
                    "min-w-0 grow",
                    !isDetailOpen &&
                        `pb-[calc(5rem+env(safe-area-inset-bottom))]
                        medium:pb-0`,
                )}
            >
                <Outlet />
            </div>
        </div>
    );
}
