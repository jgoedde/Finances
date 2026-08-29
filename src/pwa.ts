import { registerSW } from "virtual:pwa-register";

type UpdateHandlers = {
    onNeedRefresh: () => void;
    onOfflineReady: () => void;
};

// TODO: Add logger interface to allow for custom logging, e.g. to a toast notification system
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
        },
        onRegisterError(error) {
            console.error("[PWA] SW registration error:", error);
        },
    });
}
