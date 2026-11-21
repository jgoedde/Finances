import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

/**
 * Responds with the error body `{ error: code }` (plus `details`). The code
 * stays a literal type, so it reaches the web's `ApiErrorCode` via `AppType`.
 */
export function apiError<
    const Code extends string,
    Status extends ContentfulStatusCode,
    Details extends object = object,
>(c: Context, code: Code, status: Status, details?: Details) {
    return c.json({ ...(details as Details), error: code }, status);
}
