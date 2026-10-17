import { createRoot } from "react-dom/client";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { NuqsAdapter } from "nuqs/adapters/react";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createQueryClient } from "@/api/query-client.ts";
import { sessionQuery } from "@/auth/auth-client.ts";
import { registerTransactionMutations } from "@/features/transactions/transaction-mutations.ts";
import { restoreQueryClient } from "@/features/sync/persistence.ts";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";

function onUnauthorized() {
    // The session expired or was revoked: forget it and go to the login.
    // Pending changes stay queued and continue after signing in again.
    queryClient.setQueryData(sessionQuery.queryKey, null);
    if (router.state.location.pathname !== "/login") {
        void router.navigate({
            to: "/login",
            search: { redirect: router.state.location.href },
        });
    }
}

const queryClient = createQueryClient(onUnauthorized);
registerTransactionMutations(queryClient, { onUnauthorized });

// Create a new router instance
const router = createRouter({ routeTree, context: { queryClient } });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// Before rendering, so the app starts offline with the last known data.
await restoreQueryClient(queryClient);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <TooltipProvider>
                <QueryClientProvider client={queryClient}>
                    <NuqsAdapter>
                        <RouterProvider router={router} />
                    </NuqsAdapter>
                </QueryClientProvider>
            </TooltipProvider>
        </ThemeProvider>
    </StrictMode>,
);
