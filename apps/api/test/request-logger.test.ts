import { Writable } from "node:stream";
import { pino } from "pino";
import { describe, expect, it } from "vitest";
import { createTestApp } from "./test-app.ts";

describe("request logging", () => {
    async function setup() {
        const lines: Record<string, unknown>[] = [];
        const stream = new Writable({
            write(chunk: Buffer, _encoding, callback) {
                lines.push(JSON.parse(chunk.toString()));
                callback();
            },
        });
        const app = await createTestApp({ logger: pino(stream) });
        return { app, lines };
    }

    it("logs one line per request with method, path, status, duration and user id", async () => {
        const { app, lines } = await setup();
        const { id, client } = await app.signUp("alice");
        lines.length = 0;

        await client("/api/transactions?from=0&to=1");

        expect(lines).toHaveLength(1);
        expect(lines[0]).toMatchObject({
            method: "GET",
            path: "/api/transactions",
            status: 200,
            durationMs: expect.any(Number),
            userId: id,
        });
    });

    it("never logs passwords, cookies or tokens", async () => {
        const { app, lines } = await setup();
        const { client } = await app.signUp("alice");
        await client("/api/links/secret-token-123");

        const output = JSON.stringify(lines);
        expect(output).not.toContain("password123");
        expect(output).not.toContain("secret-token-123");
        expect(output).not.toMatch(/cookie|session_token/i);
        expect(lines.at(-1)).toMatchObject({ path: "/api/links/:token" });
    });

    it("logs unhandled errors with the request line", async () => {
        const { app, lines } = await setup();
        const { client } = await app.signUp("alice");
        await app.db.destroy();

        const response = await client("/api/transactions?from=0&to=1");

        expect(response.status).toBe(500);
        expect(lines.at(-1)).toMatchObject({
            level: 50,
            path: "/api/transactions",
            status: 500,
            err: { type: expect.any(String) },
        });
    });
});
