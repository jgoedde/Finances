import { createFileRoute, redirect } from "@tanstack/react-router";

// The administration, opened from the account menu; for admins only (the
// API checks the role too). Without a component it renders the matching
// child.
export const Route = createFileRoute("/_authed/_shell/admin")({
    beforeLoad: ({ context }) => {
        if (context.user.role !== "admin") {
            throw redirect({ to: "/settings" });
        }
    },
});
