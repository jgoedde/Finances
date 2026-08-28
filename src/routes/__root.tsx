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
                toast("New version available", {
                    id: UPDATE_TOAST_ID,
                    description: "Reload to update.",
                    duration: Infinity,
                    action: {
                        label: "Reload",
                        onClick: () => {
                            void updateSW(true);
                        },
                    },
                });
            },
            onOfflineReady() {
                toast.success("Ready for offline use");
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
