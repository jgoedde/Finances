import type { PriceChangeProblem } from "@finances/shared";
import { apiErrorCode } from "#/api/api-errors.ts";
import { m } from "#/paraglide/messages.js";

export const PROBLEM_MESSAGES = {
    duplicate_date: m.price_change_duplicate_date,
    before_start: m.price_change_before_start,
    after_end: m.price_change_after_end,
} as const satisfies Record<PriceChangeProblem, () => string>;

/**
 * Shown inline instead of the mutation's toast.
 */
export function isOutOfRange(error: Error): boolean {
    return apiErrorCode(error) === "price_change_out_of_range";
}
