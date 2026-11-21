import { ApiError } from "#/api/api-client.ts";
import { apiErrorCode, apiErrorMessage } from "#/api/api-errors.ts";
import { UnreadableFileError } from "#/features/data-transfer/data-transfer-api.ts";
import { m } from "#/paraglide/messages.js";

/**
 * Where validation failed, e.g. "transactions.12.date: …", if reported.
 */
function firstIssue(body: unknown): string | undefined {
    const issues = (body as { issues?: { path: unknown[]; message: string }[] })
        ?.issues;
    const issue = issues?.[0];
    return issue && `${issue.path.join(".")}: ${issue.message}`;
}

export function importErrorMessage(error: unknown): string {
    if (error instanceof UnreadableFileError) {
        return m.settings_import_invalid_file();
    }
    const code = apiErrorCode(error);
    const issue =
        error instanceof ApiError && code === "invalid_request"
            ? firstIssue(error.body)
            : undefined;
    if (issue) {
        return m.settings_import_invalid_file_detail({ issue });
    }
    // The file references a category it doesn't contain.
    if (code === "unknown_category") {
        return m.settings_import_invalid_file();
    }
    return apiErrorMessage(code) ?? m.settings_import_failed();
}
