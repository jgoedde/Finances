import { useSyncExternalStore } from "react";

// One sync drawer for the whole app, opened from the account menu or the
// rejection toast.
let isOpen = false;
const listeners = new Set<() => void>();

export function setSyncDrawerOpen(open: boolean): void {
    isOpen = open;
    listeners.forEach((listener) => listener());
}

export function useIsSyncDrawerOpen(): boolean {
    return useSyncExternalStore(
        (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        () => isOpen,
    );
}
