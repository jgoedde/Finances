import {
    createRootRouteWithContext,
    HeadContent,
    Outlet,
    useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { TRANSACTION_MUTATION_KEY } from "#/features/transactions/pending-changes.ts";
import { Toaster } from "#/components/ui/sonner.tsx";
import { ConfirmDialog } from "#/components/confirm-dialog.tsx";
import { initPWA } from "#/pwa.ts";
import { toast } from "sonner";
import { useEffect } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { m } from "#/paraglide/messages.js";

export interface RouterContext {
    queryClient: QueryClient;
}

// Routes set their own title with `head`; the deepest match wins.
export const Route = createRootRouteWithContext<RouterContext>()({
    head: () => ({ meta: [{ title: m.app_name() }] }),
    component: RootComponent,
});

const UPDATE_TOAST_ID = "update-toast";

function RootComponent() {
    const queryClient = useQueryClient();
    const router = useRouter();

    // A dialog belongs to the page that opened it, e.g. confirming to
    // delete the transaction being edited: leaving the page (also with the
    // back button) cancels it.
    useEffect(
        () =>
            router.subscribe("onBeforeNavigate", () => {
                ConfirmDialog.end(false);
            }),
        [router],
    );

    useEffect(() => {
        function showUpdateToast() {
            toast(m.pwa_update_available(), {
                id: UPDATE_TOAST_ID,
                duration: Infinity,
                action: {
                    label: m.action_reload(),
                    onClick: () => {
                        // Pending changes are safe across reloads, but
                        // updating mid-sync is not worth the risk.
                        if (
                            queryClient.isMutating({
                                mutationKey: TRANSACTION_MUTATION_KEY,
                            }) > 0
                        ) {
                            toast.error(m.pwa_wait_for_sync());
                            showUpdateToast();
                            return;
                        }
                        void updateSW(true);
                    },
                },
            });
        }

        const updateSW = initPWA({
            onNeedRefresh: showUpdateToast,
            onOfflineReady() {
                toast.success(m.pwa_offline_ready());
            },
        });
    }, [queryClient]);

    return (
        <>
            {/* Renders the title; React hoists it into <head>. */}
            <HeadContent />
            <Outlet />
            <TanStackRouterDevtools />
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster />
            <ConfirmDialog />
        </>
    );
}
