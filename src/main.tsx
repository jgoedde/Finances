import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Provider } from "react-redux";
import { store } from "@/store.ts";
import { StrictMode } from "react";
import { NuqsAdapter } from "nuqs/adapters/react";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <NuqsAdapter>
                <Provider store={store}>
                    <App />
                </Provider>
            </NuqsAdapter>
        </ThemeProvider>
    </StrictMode>,
);
