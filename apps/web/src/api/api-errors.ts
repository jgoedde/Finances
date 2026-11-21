import type { AppType } from "@finances/api";
import type { ExtractSchema } from "hono/types";
import { ApiError } from "#/api/api-client.ts";
import { m } from "#/paraglide/messages.js";

type Schema = ExtractSchema<AppType>;

/**
 * Every response body of every route and status.
 */
type ResponseBody = {
    [Path in keyof Schema]: {
        [Method in keyof Schema[Path]]: Schema[Path][Method] extends {
            output: infer Output;
        }
            ? Output
            : never;
    }[keyof Schema[Path]];
}[keyof Schema];

/**
 * A code widened to `string` (a handler without `as const`) would swallow
 * all others; this name shows up in the build error instead.
 */
type Literal<Code> = string extends Code
    ? "error code widened to string: add `as const` in the API"
    : Code;

/**
 * Codes Hono doesn't infer into the route types: the session middleware's
 * and the import's body limit. (The validators' `invalid_request` is
 * inferred; the error handler sends the same code.)
 */
type UninferredCode = "unauthorized" | "forbidden" | "file_too_large";

/**
 * Every error code the API sends as `{ error: code }`.
 */
export type ApiErrorCode =
    | Literal<Extract<ResponseBody, { error: unknown }>["error"]>
    | UninferredCode;

// The API answers errors with `{ error: code }`; the client words them. A
// missing or extra code fails the build.
const MESSAGES = {
    account_not_empty: m.api_error_account_not_empty,
    category_in_use: m.api_error_category_in_use,
    category_kind_mismatch: m.api_error_category_kind_mismatch,
    category_name_taken: m.api_error_category_name_taken,
    fallback_category: m.api_error_fallback_category,
    file_too_large: m.api_error_file_too_large,
    forbidden: m.api_error_forbidden,
    invalid_link: m.api_error_invalid_link,
    invalid_main_expense: m.api_error_invalid_main_expense,
    invalid_request: m.api_error_invalid_request,
    main_expense_kind: m.api_error_main_expense_kind,
    not_found: m.api_error_not_found,
    price_change_out_of_range: m.api_error_price_change_out_of_range,
    unauthorized: m.api_error_unauthorized,
    unknown_category: m.api_error_unknown_category,
    unknown_user: m.api_error_unknown_user,
    username_required: m.api_error_username_required,
    username_taken: m.api_error_username_taken,
} satisfies Record<ApiErrorCode, () => string>;

function isApiErrorCode(code: unknown): code is ApiErrorCode {
    return typeof code === "string" && Object.hasOwn(MESSAGES, code);
}

/**
 * The API's error code (e.g. `not_found`), if the API sent one this client
 * knows.
 */
export function apiErrorCode(error: unknown): ApiErrorCode | undefined {
    if (!(error instanceof ApiError)) {
        return undefined;
    }
    const code = (error.body as { error?: unknown } | null | undefined)?.error;
    return isApiErrorCode(code) ? code : undefined;
}

/**
 * The message for an API error code, or undefined for unknown codes (e.g. a
 * stored sync failure from another version).
 */
export function apiErrorMessage(code: string | undefined): string | undefined {
    return isApiErrorCode(code) ? MESSAGES[code]() : undefined;
}
