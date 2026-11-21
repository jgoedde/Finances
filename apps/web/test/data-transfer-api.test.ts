import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "#/api/api-client.ts";
import { downloadExport } from "#/features/data-transfer/data-transfer-api.ts";

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

/**
 * Captures the blobs handed to `URL.createObjectURL`.
 */
function captureBlobs(): Blob[] {
    const blobs: Blob[] = [];
    URL.createObjectURL = (blob: Blob) => {
        blobs.push(blob);
        return "blob:export";
    };
    URL.revokeObjectURL = () => {};
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    return blobs;
}

describe("downloadExport", () => {
    it("saves the response bytes as they came", async () => {
        const body = '{\n  "version": 7, "exportedAt": "2026-11-21"\n}';
        vi.stubGlobal("fetch", () =>
            Promise.resolve(
                new Response(body, {
                    headers: {
                        "content-type": "application/json",
                        "content-disposition":
                            'attachment; filename="finances-2026-11-21.json"',
                    },
                }),
            ),
        );
        const blobs = captureBlobs();

        await downloadExport();

        expect(blobs).toHaveLength(1);
        expect(await blobs[0]?.text()).toBe(body);
    });

    it("throws an ApiError for error responses", async () => {
        vi.stubGlobal("fetch", () =>
            Promise.resolve(
                Response.json({ error: "unauthorized" }, { status: 401 }),
            ),
        );
        const blobs = captureBlobs();

        const failure = downloadExport();

        await expect(failure).rejects.toBeInstanceOf(ApiError);
        await expect(failure).rejects.toMatchObject({
            status: 401,
            body: { error: "unauthorized" },
        });
        expect(blobs).toEqual([]);
    });
});
