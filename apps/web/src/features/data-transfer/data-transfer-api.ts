import type { ImportResult } from "@finances/shared";
import type { InferRequestType } from "hono/client";
import { api, unwrap } from "#/api/api-client.ts";

type ImportRequest = InferRequestType<typeof api.data.import.$post>;

/**
 * Downloads all of the user's data as a JSON file.
 */
export async function downloadExport(): Promise<void> {
    const response = await api.data.export.$get();
    const data = await unwrap(response);

    const fileName =
        /filename="([^"]+)"/.exec(
            response.headers.get("content-disposition") ?? "",
        )?.[1] ?? "finances.json";
    const url = URL.createObjectURL(
        new Blob([JSON.stringify(data)], { type: "application/json" }),
    );
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
    return unwrap(
        api.data.import.$post({
            query: { replace: replace ? "true" : undefined },
            // Unchecked: the API validates the file.
            json: data as ImportRequest["json"],
        }),
    );
}
