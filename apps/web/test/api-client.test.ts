import { onlineManager } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { api, ApiError, unwrap } from "#/api/api-client.ts";
import { apiErrorCode } from "#/api/api-errors.ts";

/**
 * Answers every request with the given response; returns the fetch mock.
 */
function answer(response: () => Response | Promise<Response>) {
    const fetch = vi.fn(() => Promise.resolve(response()));
    vi.stubGlobal("fetch", fetch);
    return fetch;
}

afterEach(() => {
    vi.unstubAllGlobals();
    onlineManager.setOnline(true);
});

describe("the API client", () => {
    it("returns the JSON body of a success response", async () => {
        const fetch = answer(() => Response.json([{ id: "c1" }]));

        await expect(unwrap(api.categories.$get())).resolves.toEqual([
            { id: "c1" },
        ]);
        expect(fetch).toHaveBeenCalledWith(
            "/api/categories",
            expect.objectContaining({ credentials: "same-origin" }),
        );
    });

    it("sends params, query and JSON bodies", async () => {
        const fetch = answer(() => new Response(null, { status: 204 }));

        await unwrap(
            api.categories[":id"].$delete({
                param: { id: "c1" },
                query: { moveTo: "c2" },
            }),
        );
        await unwrap(
            api.categories[":id"].$patch({
                param: { id: "c1" },
                json: { name: "Essen" },
            }),
        );

        expect(fetch.mock.calls).toEqual([
            [
                "/api/categories/c1?moveTo=c2",
                expect.objectContaining({ method: "DELETE" }),
            ],
            [
                "/api/categories/c1",
                expect.objectContaining({
                    method: "PATCH",
                    body: JSON.stringify({ name: "Essen" }),
                }),
            ],
        ]);
    });

    it("resolves to undefined for an empty response", async () => {
        answer(() => new Response(null, { status: 204 }));

        await expect(
            unwrap(api.transactions[":id"].$delete({ param: { id: "t1" } })),
        ).resolves.toBeUndefined();
    });

    it("throws an ApiError with status and body for a failed request", async () => {
        answer(() => Response.json({ error: "not_found" }, { status: 404 }));

        const error = await unwrap(
            api.transactions[":id"].$get({ param: { id: "t1" } }),
        ).catch((e: unknown) => e);

        expect(error).toBeInstanceOf(ApiError);
        expect(error).toMatchObject({
            status: 404,
            body: { error: "not_found" },
        });
    });

    it("goes offline when a request never reaches the server", async () => {
        const failure = new TypeError("Failed to fetch");
        answer(() => Promise.reject(failure));

        await expect(unwrap(api.categories.$get())).rejects.toBe(failure);
        expect(onlineManager.isOnline()).toBe(false);
    });
});

describe("apiErrorCode", () => {
    it("reads the code from the body of an ApiError", () => {
        expect(apiErrorCode(new ApiError(404, { error: "not_found" }))).toBe(
            "not_found",
        );
    });

    it("is undefined for other errors and bodies without a code", () => {
        expect(apiErrorCode(new Error("boom"))).toBeUndefined();
        expect(apiErrorCode(new ApiError(500, undefined))).toBeUndefined();
        expect(apiErrorCode(new ApiError(400, { issues: [] }))).toBeUndefined();
    });
});
