import type { MouseEvent } from "react";
import { isAfter, startOfMonth } from "date-fns";

export function isFuture(month: Date) {
    return isAfter(month, startOfMonth(new Date()));
}

/**
 * Whether a click should open the link the browser's way (new tab, window…)
 * instead of sliding to the month. `Link` checks the same, but only after our
 * `onClick` has run.
 */
export function isModifiedClick(event: MouseEvent) {
    return (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    );
}
