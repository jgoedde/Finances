import type { ImportResult } from "@finances/shared";
import { ApiError, apiFetch } from "#/api/api-client.ts";

async function throwIfFailed(response: Response): Promise<void> {
    if (!response.ok) {
        const text = await response.text();
        throw new ApiError(response.status, text ? JSON.parse(text) : null);
    }
}

/**
 * Downloads all of the user's data as a JSON file.
 */
export async function downloadExport(): Promise<void> {
    const response = await fetch("/api/data/export", {
        credentials: "same-origin",
    });
    await throwIfFailed(response);

    const fileName =
        /filename="([^"]+)"/.exec(
            response.headers.get("content-disposition") ?? "",
        )?.[1] ?? "finances.json";
    const url = URL.createObjectURL(await response.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

/**
 * The file isn't JSON, so it can't be an export.
 */
export class UnreadableFileError extends Error {
    constructor() {
        super("The file is not JSON");
        this.name = "UnreadableFileError";
    }
}

/**
 * Uploads an export; the API validates it. Without `replace` the account must
 * be empty (409 otherwise); with it, all existing data is replaced.
 */
export async function importFile(
    file: File,
    { replace = false } = {},
): Promise<ImportResult> {
    let data: unknown;
    try {
        data = JSON.parse(await file.text());
    } catch {
        throw new UnreadableFileError();
    }
    const query = replace ? "?replace=true" : "";
    return apiFetch<ImportResult>(`/data/import${query}`, {
        method: "POST",
        body: data,
    });
}
