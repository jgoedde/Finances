import { createRoot } from "react-dom/client";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Provider } from "react-redux";
import { store } from "@/store.ts";
import { NuqsAdapter } from "nuqs/adapters/react";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { initDatabase } from "@/persistence/db.ts";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

await initDatabase();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <NuqsAdapter>
                <Provider store={store}>
                    <RouterProvider router={router} />
                </Provider>
            </NuqsAdapter>
        </ThemeProvider>
    </StrictMode>,
);
