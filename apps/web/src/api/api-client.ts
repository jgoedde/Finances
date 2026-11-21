import type { AppType } from "@finances/api";
import { type ClientResponse, hc } from "hono/client";
import type { SuccessStatusCode } from "hono/utils/http-status";
import { reportNetworkFailure } from "#/features/sync/connectivity.ts";

export class ApiError extends Error {
    readonly status: number;
    readonly body: unknown;

    constructor(status: number, body: unknown) {
        super(`API request failed with status ${status}`);
        this.name = "ApiError";
        this.status = status;
        this.body = body;
    }
}

export function isUnauthorized(error: unknown): boolean {
    return error instanceof ApiError && error.status === 401;
}

/**
 * Same origin with the session cookie; reports requests that never reach the
 * server.
 */
async function sameOriginFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
): Promise<Response> {
    try {
        return await fetch(input, { ...init, credentials: "same-origin" });
    } catch (error) {
        reportNetworkFailure();
        throw error;
    }
}

/**
 * The typed API client: paths, params, query, bodies and responses come from
 * the API's router (`AppType`). Pass its responses to {@link unwrap}.
 */
export const api = hc<AppType>("/", { fetch: sameOriginFetch }).api;

/**
 * The body of the response's success statuses; undefined for 204.
 */
type SuccessBody<R> =
    R extends ClientResponse<infer T, infer S>
        ? S extends SuccessStatusCode
            ? S extends 204
                ? undefined
                : T
            : never
        : never;

async function readJson(response: Response): Promise<unknown> {
    const text = await response.text();
    return text ? JSON.parse(text) : undefined;
}

/**
 * Throws {@link ApiError} for non-2xx responses; resolves to the response
 * otherwise, for reading a body that isn't JSON (else use {@link unwrap}).
 */
export async function ensureOk<R extends ClientResponse<unknown>>(
    response: R | Promise<R>,
): Promise<R> {
    const resolved = await response;
    if (!resolved.ok) {
        throw new ApiError(resolved.status, await readJson(resolved));
    }
    return resolved;
}

/**
 * Throws {@link ApiError} for non-2xx responses; resolves to undefined for
 * empty responses and to the JSON body otherwise.
 */
export async function unwrap<R extends ClientResponse<unknown>>(
    response: R | Promise<R>,
): Promise<SuccessBody<R>> {
    return (await readJson(await ensureOk(response))) as SuccessBody<R>;
}
