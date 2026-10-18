import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
    window.addEventListener("scroll", onChange, { passive: true });

    return () => window.removeEventListener("scroll", onChange);
}

/**
 * Whether the window is scrolled away from the top.
 */
export function useIsScrolled() {
    return useSyncExternalStore(subscribe, () => window.scrollY > 0);
}
