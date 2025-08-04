import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
    beforeLoad: () => {
        console.log(location.pathname, "location.pathname");
        if (
            sessionStorage.getItem("encryption-key") == null &&
            location.pathname !== "/unlock"
        ) {
            throw redirect({ to: "/unlock" });
        }
    },
});
