import { createRoot } from "react-dom/client";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { NuqsAdapter } from "nuqs/adapters/react";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createQueryClient } from "@/api/query-client.ts";

const queryClient = createQueryClient(() => {
    // The session expired or was revoked: forget it and go to the login.
    queryClient.setQueryData(["session"], null);
    if (router.state.location.pathname !== "/login") {
        void router.navigate({
            to: "/login",
            search: { redirect: router.state.location.href },
        });
    }
});

// Create a new router instance
const router = createRouter({ routeTree, context: { queryClient } });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <NuqsAdapter>
                    <RouterProvider router={router} />
                </NuqsAdapter>
            </QueryClientProvider>
        </ThemeProvider>
    </StrictMode>,
);
