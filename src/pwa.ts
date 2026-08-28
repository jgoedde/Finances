import { registerSW } from "virtual:pwa-register";

type UpdateHandlers = {
    onNeedRefresh: () => void;
    onOfflineReady: () => void;
};

export function initPWA(handlers: UpdateHandlers) {
    return registerSW({
        immediate: true,
        onNeedRefresh: handlers.onNeedRefresh,
        onOfflineReady: handlers.onOfflineReady,
        onRegisteredSW(_, registration) {
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
    });
}
