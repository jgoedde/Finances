import { monthStartUtc, shiftMonth } from "@finances/shared";

/**
 * Covers every time zone's offset from UTC when narrowing by date.
 */
const MAX_OFFSET_MS = 2 * 24 * 60 * 60 * 1000;

/**
 * The instants (Unix ms) to load transactions for, from `firstMonth` through
 * `lastMonth`, wide enough for any time zone.
 */
export function loadWindow(
    firstMonth: string,
    lastMonth: string,
): { from: number; to: number } {
    return {
        from: monthStartUtc(firstMonth) - MAX_OFFSET_MS,
        to: monthStartUtc(shiftMonth(lastMonth, 1)) + MAX_OFFSET_MS,
    };
}
