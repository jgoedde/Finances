import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { store } from "@/store.ts";

export const Route = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
    beforeLoad: ({ location }) => {
        const masterPassword = store.getState().app.masterPassword;
        if (
            (!masterPassword || masterPassword.trim() === "") &&
            location.pathname !== "/setup" &&
            location.pathname !== "/blob"
        ) {
            throw redirect({
                to: "/setup",
                search: {
                    redirect: location.href,
                },
            });
        }
    },
});
