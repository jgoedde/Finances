import { createRoot } from "react-dom/client";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Provider } from "react-redux";
import { store } from "@/store.ts";
import { NuqsAdapter } from "nuqs/adapters/react";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { GitHubClientProvider } from "@/gitHubClient.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <NuqsAdapter>
                <GitHubClientProvider>
                    <QueryClientProvider client={queryClient}>
                        <Provider store={store}>
                            <RouterProvider router={router} />
                        </Provider>
                    </QueryClientProvider>
                </GitHubClientProvider>
            </NuqsAdapter>
        </ThemeProvider>
    </StrictMode>,
);
