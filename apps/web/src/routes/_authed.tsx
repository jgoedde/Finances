import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionQuery } from "#/auth/auth-client.ts";
import { SyncDrawer } from "#/features/sync/sync-drawer.tsx";
import { SyncIndicator } from "#/features/sync/sync-indicator.tsx";

// Every route below requires a signed-in user.
export const Route = createFileRoute("/_authed")({
    beforeLoad: async ({ context, location }) => {
        const user = await context.queryClient.query({
            ...sessionQuery,
            staleTime: "static",
        });
        if (!user) {
            throw redirect({
                to: "/login",
                search: { redirect: location.href },
            });
        }
        return { user };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <Outlet />
            {/* Sync feedback on every app page, above the page itself. */}
            <SyncIndicator />
            <SyncDrawer />
        </>
    );
}
