import { z } from "zod";

/**
 * A boolean query parameter: `true` or `false`. Clients encode it with
 * {@link toBooleanQuery}.
 */
export const booleanQuery = z
    .enum(["true", "false"])
    .transform((value) => value === "true");

/**
 * A lenient {@link booleanQuery}: anything but `true` (or nothing) is false.
 */
export const booleanFlagQuery = z
    .string()
    .optional()
    .transform((value) => value === "true");

/**
 * Encodes a boolean for {@link booleanQuery} and {@link booleanFlagQuery};
 * undefined stays out of the query.
 */
export function toBooleanQuery(
    value: boolean | undefined,
): "true" | "false" | undefined {
    return value === undefined ? undefined : value ? "true" : "false";
}
