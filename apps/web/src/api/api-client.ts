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
 * Calls the API (same origin, session cookie). Throws {@link ApiError} for
 * non-2xx responses; resolves to undefined for empty responses.
 */
export async function apiFetch<T>(
    path: string,
    init: Omit<RequestInit, "body"> & { body?: unknown } = {},
): Promise<T> {
    const headers = new Headers(init.headers);
    let body: BodyInit | undefined;
    if (init.body !== undefined) {
        headers.set("content-type", "application/json");
        body = JSON.stringify(init.body);
    }

    const response = await fetch(`/api${path}`, {
        ...init,
        headers,
        body,
        credentials: "same-origin",
    });

    const text = await response.text();
    const data: unknown = text ? JSON.parse(text) : undefined;
    if (!response.ok) {
        throw new ApiError(response.status, data);
    }
    return data as T;
}

/** Builds a query string, skipping undefined values. */
export function toQueryString<
    T extends { [K in keyof T]: string | number | boolean | undefined },
>(params: T): string {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params) as [
        string,
        string | number | boolean | undefined,
    ][]) {
        if (value !== undefined) {
            search.set(key, String(value));
        }
    }
    return search.toString();
}
