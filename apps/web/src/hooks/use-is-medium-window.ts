import { useSyncExternalStore } from "react";

/**
 * `--breakpoint-medium` in globals.css.
 */
const MEDIUM_WINDOW = "(min-width: 37.5rem)";

let mediumWindowQuery: MediaQueryList | undefined;

/**
 * The media query, created on first use (not at import, so modules load
 * without a window).
 */
function getMediumWindowQuery(): MediaQueryList {
    mediumWindowQuery ??= window.matchMedia(MEDIUM_WINDOW);
    return mediumWindowQuery;
}

function subscribe(onChange: () => void) {
    const query = getMediumWindowQuery();
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
        () => getMediumWindowQuery().matches,
    );
}
