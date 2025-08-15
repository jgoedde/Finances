import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { store } from "@/store.ts";
import { Toaster } from "@/components/ui/sonner.tsx";

export const Route = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
            <Toaster />
        </>
    ),
    beforeLoad: () => {
        const masterPassword = store.getState().app.masterPassword;
        if (
            (!masterPassword || masterPassword.trim() === "") &&
            location.pathname !== "/setup" &&
            location.pathname !== "/blob"
        ) {
            throw redirect({ to: "/setup" });
        }
    },
});
