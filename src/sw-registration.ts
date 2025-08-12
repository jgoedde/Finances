import { registerSW } from "virtual:pwa-register";

export function registerServiceWorker() {
    registerSW({
        onNeedRefresh() {
            // Optionally show a "new version available" UI
        },
        onOfflineReady() {
            console.log("App ready to work offline");
        },
    });
}
