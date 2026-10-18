import {
    createFileRoute,
    Outlet,
    retainSearchParams,
} from "@tanstack/react-router";
import { monthSearchSchema } from "#/features/month/month.ts";
import { AppNavigation } from "#/features/navigation/app-navigation.tsx";

// The destinations with their navigation. The selected month carries over
// when switching between them.
export const Route = createFileRoute("/_authed/_shell")({
    validateSearch: monthSearchSchema,
    search: { middlewares: [retainSearchParams(["month"])] },
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className={"medium:flex"}>
            <AppNavigation />
            <div
                className={`min-w-0 grow
                    pb-[calc(5rem+env(safe-area-inset-bottom))] medium:pb-0`}
            >
                <Outlet />
            </div>
        </div>
    );
}
