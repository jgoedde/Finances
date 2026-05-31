import { createRoot } from "react-dom/client";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { NuqsAdapter } from "nuqs/adapters/react";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { PersistentDatabase } from "@/persistence/persistent-database.ts";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

await PersistentDatabase.init();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <NuqsAdapter>
                <RouterProvider router={router} />
            </NuqsAdapter>
        </ThemeProvider>
    </StrictMode>,
);
