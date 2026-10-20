import { useSyncExternalStore } from "react";

/**
 * `--breakpoint-medium` in globals.css.
 */
const MEDIUM_WINDOW = "(min-width: 37.5rem)";

function subscribe(onChange: () => void) {
    const query = window.matchMedia(MEDIUM_WINDOW);
    query.addEventListener("change", onChange);

    return () => query.removeEventListener("change", onChange);
}

/**
 * Whether the window is in the medium size class or wider (`medium:`), for
 * layouts CSS alone can't switch.
 */
export function useIsMediumWindow() {
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(MEDIUM_WINDOW).matches,
    );
}
