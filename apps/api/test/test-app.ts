import { Hono } from "hono";
import type { Logger } from "pino";
import { createApp } from "#/app.ts";
import { authOptions, createAuth, createUser } from "#/auth/auth.ts";
import { openDatabase } from "#/db/database.ts";
import { migrate } from "#/db/migrate.ts";
import { requestLogger } from "#/http/request-logger.ts";

const BASE_URL = "http://localhost:3000";
const PASSWORD = "password123";

/**
 * Reads a JSON response body as `T` (tests trust the server's shape).
 */
export async function json<T>(response: Response | Promise<Response>) {
    return (await (await response).json()) as T;
}

export type Client = (path: string, init?: RequestInit) => Promise<Response>;

/**
 * A fresh app on an in-memory database (or `filename`); logs requests to
 * `logger` if given.
 */
export async function createTestApp({
    logger,
    filename = ":memory:",
}: { logger?: Logger; filename?: string } = {}) {
    const db = openDatabase(filename);
    const config = {
        secret: "test-secret-that-is-long-enough-123",
        baseURL: BASE_URL,
    };
    await migrate(db, authOptions(db, config));
    const auth = createAuth(db, config);
    const app = new Hono();
    if (logger) {
        app.use("/api/*", requestLogger(logger));
    }
    app.route("/", createApp(db, auth));

    async function request(path: string, init: RequestInit = {}) {
        const headers = new Headers(init.headers);
        headers.set("origin", BASE_URL);
        if (init.body && !headers.has("content-type")) {
            headers.set("content-type", "application/json");
        }
        return app.request(`${BASE_URL}${path}`, { ...init, headers });
    }

    /**
     * Signs in and returns a client that sends the session cookie.
     */
    async function login(username: string, password = PASSWORD) {
        const response = await request("/api/auth/sign-in/username", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            throw new Error(`Login failed with ${response.status}`);
        }
        const cookie = response.headers
            .getSetCookie()
            .map((c) => c.split(";")[0])
            .join("; ");
        const client: Client = (path, init = {}) => {
            const headers = new Headers(init.headers);
            headers.set("cookie", cookie);
            return request(path, { ...init, headers });
        };
        return client;
    }

    async function signUp(username: string, role: "admin" | "user" = "user") {
        const user = await createUser(auth, {
            username,
            password: PASSWORD,
            role,
        });
        return { id: user.id, client: await login(username) };
    }

    return { db, request, login, signUp };
}

export function transactionBody(overrides: Record<string, unknown> = {}) {
    return JSON.stringify({
        date: Date.now(),
        name: "Brot",
        description: null,
        kind: "expense",
        amount: 3.5,
        currency: "EUR",
        categoryId: "2",
        exceptional: false,
        ...overrides,
    });
}
