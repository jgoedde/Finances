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
    beforeLoad: () => {
        const masterPassword = store.getState().app.masterPassword;
        if (
            (!masterPassword ||
                masterPassword.trim() === "" ||
                localStorage.getItem("finances-login") == null) &&
            location.pathname !== "/setup"
        ) {
            throw redirect({ to: "/setup" });
        }
    },
});
