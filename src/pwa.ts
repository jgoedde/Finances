import { registerSW } from "virtual:pwa-register";

type UpdateHandlers = {
    onNeedRefresh: () => void;
    onOfflineReady: () => void;
};

export function initPWA(handlers: UpdateHandlers) {
    return registerSW({
        immediate: true,
        onNeedRefresh: () => {
            console.log("[PWA] New content is available; please refresh.");
            handlers.onNeedRefresh();
        },
        onOfflineReady: () => {
            console.log("[PWA] onOfflineReady fired");
            handlers.onOfflineReady();
        },
        onRegisteredSW(swUrl, registration) {
            console.log("[PWA] SW registered:", swUrl, registration);

            // Poll for updates periodically (e.g. every hour) since users
            // may leave the tab open for days on a self-hosted app
            if (registration) {
                setInterval(
                    () => {
                        void registration.update();
                    },
                    60 * 60 * 1000,
                );
            }
        },
        onRegisterError(error) {
            console.error("[PWA] SW registration error:", error);
        },
    });
}
