import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionQuery } from "#/auth/auth-client.ts";

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
    component: Outlet,
});
