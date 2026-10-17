import { useSyncExternalStore } from "react";
import { onlineManager } from "@tanstack/react-query";

// TanStack's onlineManager follows the browser's online/offline events. Those
// miss "connected but nothing gets through" (dead spots, captive portals), so
// failed requests also mark the app offline until the server answers again.

const RECHECK_INTERVAL_MS = 30 * 1000;

let recheckTimer: number | undefined;

/** A request failed without reaching the server. */
export function reportNetworkFailure(): void {
    if (onlineManager.isOnline()) {
        onlineManager.setOnline(false);
    }
    scheduleRecheck();
}

/** Asks the server right away; goes back online if it answers. */
export async function checkConnection(): Promise<boolean> {
    try {
        const response = await fetch("/api/health", { cache: "no-store" });
        if (response.ok) {
            window.clearTimeout(recheckTimer);
            onlineManager.setOnline(true);
            return true;
        }
    } catch {
        // still offline
    }
    return false;
}

function scheduleRecheck(): void {
    window.clearTimeout(recheckTimer);
    recheckTimer = window.setTimeout(() => {
        void checkConnection().then((isOnline) => {
            if (!isOnline) {
                scheduleRecheck();
            }
        });
    }, RECHECK_INTERVAL_MS);
}

export function useIsOnline(): boolean {
    return useSyncExternalStore(
        (listener) => onlineManager.subscribe(listener),
        () => onlineManager.isOnline(),
    );
}

/** Appended to "saved" messages while changes can't be sent. */
export function syncLaterHint(): string {
    return onlineManager.isOnline()
        ? ""
        : " – wird synchronisiert, sobald Du online bist";
}
