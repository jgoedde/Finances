import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { TRANSACTION_MUTATION_KEY } from "#/features/transactions/pending-changes.ts";
import { Toaster } from "#/components/ui/sonner.tsx";
import { initPWA } from "#/pwa.ts";
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
    const queryClient = useQueryClient();

    useEffect(() => {
        function showUpdateToast() {
            toast(
                "Neue Version verfügbar. Seite neu laden zum Aktualisieren.",
                {
                    id: UPDATE_TOAST_ID,
                    duration: Infinity,
                    action: {
                        label: "Neu laden",
                        onClick: () => {
                            // Pending changes are safe across reloads, but
                            // updating mid-sync is not worth the risk.
                            if (
                                queryClient.isMutating({
                                    mutationKey: TRANSACTION_MUTATION_KEY,
                                }) > 0
                            ) {
                                toast.error(
                                    "Bitte warte, bis alle Änderungen synchronisiert sind.",
                                );
                                showUpdateToast();
                                return;
                            }
                            void updateSW(true);
                        },
                    },
                },
            );
        }

        const updateSW = initPWA({
            onNeedRefresh: showUpdateToast,
            onOfflineReady() {
                toast.success("Bereit für Offline-Nutzung");
            },
        });
    }, [queryClient]);

    return (
        <>
            <Outlet />
            <TanStackRouterDevtools />
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster />
        </>
    );
}
