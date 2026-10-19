import { ApiError } from "#/api/api-client.ts";
import { m } from "#/paraglide/messages.js";

// The API answers errors with `{ error: code }`; the client words them.
const MESSAGES = {
    account_not_empty: m.api_error_account_not_empty,
    file_too_large: m.api_error_file_too_large,
    forbidden: m.api_error_forbidden,
    invalid_link: m.api_error_invalid_link,
    invalid_request: m.api_error_invalid_request,
    not_found: m.api_error_not_found,
    unauthorized: m.api_error_unauthorized,
    unknown_category: m.api_error_unknown_category,
    unknown_user: m.api_error_unknown_user,
    username_required: m.api_error_username_required,
    username_taken: m.api_error_username_taken,
} satisfies Record<string, () => string>;

type ApiErrorCode = keyof typeof MESSAGES;

/**
 * The API's error code (e.g. `not_found`), if the API sent one.
 */
export function apiErrorCode(error: unknown): string | undefined {
    if (!(error instanceof ApiError)) {
        return undefined;
    }
    const code = (error.body as { error?: unknown } | null | undefined)?.error;
    return typeof code === "string" ? code : undefined;
}

/**
 * The message for an API error code, or undefined for unknown codes.
 */
export function apiErrorMessage(code: string | undefined): string | undefined {
    return code !== undefined &&
        Object.prototype.hasOwnProperty.call(MESSAGES, code)
        ? MESSAGES[code as ApiErrorCode]()
        : undefined;
}
