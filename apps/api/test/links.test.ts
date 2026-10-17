import { beforeEach, describe, expect, it } from "vitest";
import type { CreatedLink, LinkInfo } from "@finances/shared";
import { type Client, createTestApp, json } from "./test-app.ts";

const HOUR_MS = 60 * 60 * 1000;

describe("links", () => {
    let app: Awaited<ReturnType<typeof createTestApp>>;
    let admin: Client;

    beforeEach(async () => {
        app = await createTestApp();
        admin = (await app.signUp("admin", "admin")).client;
    });

    function createInvite(client = admin) {
        return client("/api/admin/invites", { method: "POST" });
    }

    function createPasswordResetLink(userId: string, client = admin) {
        return client("/api/admin/password-reset-links", {
            method: "POST",
            body: JSON.stringify({ userId }),
        });
    }

    function redeem(token: string, body: object) {
        return app.request(`/api/links/${token}/redeem`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    function hoursUntil(expiresAt: string) {
        return (new Date(expiresAt).getTime() - Date.now()) / HOUR_MS;
    }

    it("lets an invited person sign up exactly once", async () => {
        const { token, expiresAt } = await json<CreatedLink>(createInvite());
        expect(hoursUntil(expiresAt)).toBeCloseTo(7 * 24, 0);

        expect(
            await json<LinkInfo>(app.request(`/api/links/${token}`)),
        ).toEqual({ kind: "invite", username: null });

        const first = await redeem(token, {
            username: "Carol",
            password: "carols-password",
        });
        expect(first.status).toBe(204);

        const carol = await app.login("carol", "carols-password");
        const categories = await json<unknown[]>(carol("/api/categories"));
        expect(categories).toHaveLength(10);

        const again = await redeem(token, {
            username: "dave",
            password: "daves-password",
        });
        expect(again.status).toBe(410);
    });

    it("frees the invite when the username is taken", async () => {
        const { token } = await json<CreatedLink>(createInvite());

        expect(
            (await redeem(token, { username: "admin", password: "whatever1" }))
                .status,
        ).toBe(409);
        expect(
            (await redeem(token, { username: "erin", password: "whatever1" }))
                .status,
        ).toBe(204);
    });

    it("resets a password and signs the user out", async () => {
        const bob = await app.signUp("bob");
        const { token, expiresAt } = await json<CreatedLink>(
            createPasswordResetLink(bob.id),
        );
        expect(hoursUntil(expiresAt)).toBeCloseTo(24, 0);

        expect(
            await json<LinkInfo>(app.request(`/api/links/${token}`)),
        ).toEqual({ kind: "password-reset", username: "bob" });

        expect((await redeem(token, { password: "new-password" })).status).toBe(
            204,
        );
        expect((await bob.client("/api/categories")).status).toBe(401);
        await expect(app.login("bob")).rejects.toThrow();
        await app.login("bob", "new-password");
    });

    it("rejects password reset links for unknown users", async () => {
        expect((await createPasswordResetLink("nobody")).status).toBe(422);
    });

    it("is admin-only to create", async () => {
        const { client } = await app.signUp("mallory");
        expect((await createInvite(client)).status).toBe(403);
        expect((await createPasswordResetLink("whoever", client)).status).toBe(
            403,
        );
    });

    it("blocks public sign-up", async () => {
        const response = await app.request("/api/auth/sign-up/email", {
            method: "POST",
            body: JSON.stringify({
                email: "x@example.com",
                password: "password123",
                name: "x",
            }),
        });
        expect(response.ok).toBe(false);
    });
});
