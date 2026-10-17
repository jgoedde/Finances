import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/sonner.tsx";
import { initPWA } from "@/pwa.ts";
import { toast } from "sonner";
import { useEffect } from "react";

export const Route = createRootRoute({
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
            <Toaster />
        </>
    );
}
