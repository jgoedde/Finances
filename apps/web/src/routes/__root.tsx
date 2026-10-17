import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner.tsx";
import { initPWA } from "@/pwa.ts";
import { toast } from "sonner";
import { useEffect } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export interface RouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootComponent,
});

const UPDATE_TOAST_ID = "update-toast";

function RootComponent() {
    useEffect(() => {
        const updateSW = initPWA({
            onNeedRefresh() {
                toast(
                    "Neue Version verfügbar. Seite neu laden zum Aktualisieren.",
                    {
                        id: UPDATE_TOAST_ID,
                        duration: Infinity,
                        action: {
                            label: "Neu laden",
                            onClick: () => {
                                void updateSW(true);
                            },
                        },
                    },
                );
            },
            onOfflineReady() {
                toast.success("Bereit für Offline-Nutzung");
            },
        });
    }, []);

    return (
        <>
            <Outlet />
            <TanStackRouterDevtools />
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster />
        </>
    );
}
