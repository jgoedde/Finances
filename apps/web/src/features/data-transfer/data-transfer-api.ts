import type { ImportResult } from "@finances/shared";
import { ApiError } from "#/api/api-client.ts";

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
 * Uploads a JSON export or a legacy `.db` file. Without `replace` the account
 * must be empty (409 otherwise); with it, all existing data is replaced.
 */
export async function importFile(
    file: File,
    { replace = false } = {},
): Promise<ImportResult> {
    const query = replace ? "?replace=true" : "";
    const response = await fetch(`/api/data/import${query}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/octet-stream" },
        body: file,
    });
    await throwIfFailed(response);
    return (await response.json()) as ImportResult;
}
