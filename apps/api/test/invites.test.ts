import { beforeEach, describe, expect, it } from "vitest";
import type { CreatedInvite, InviteInfo } from "@finances/shared";
import { type Client, createTestApp, json } from "./test-app.ts";

describe("invites", () => {
    let app: Awaited<ReturnType<typeof createTestApp>>;
    let admin: Client;

    beforeEach(async () => {
        app = await createTestApp();
        admin = (await app.signUp("admin", "admin")).client;
    });

    async function createInvite(body: object, client = admin) {
        return client("/api/admin/invites", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    function accept(token: string, body: object) {
        return app.request(`/api/invites/${token}/accept`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    it("lets an invited person sign up exactly once", async () => {
        const { token } = await json<CreatedInvite>(
            createInvite({ kind: "signup" }),
        );

        expect(
            await json<InviteInfo>(app.request(`/api/invites/${token}`)),
        ).toEqual({ kind: "signup", username: null });

        const first = await accept(token, {
            username: "Carol",
            password: "carols-password",
        });
        expect(first.status).toBe(204);

        const carol = await app.login("carol", "carols-password");
        const categories = await json<unknown[]>(carol("/api/categories"));
        expect(categories).toHaveLength(10);

        const again = await accept(token, {
            username: "dave",
            password: "daves-password",
        });
        expect(again.status).toBe(410);
    });

    it("frees the invite when the username is taken", async () => {
        const { token } = await json<CreatedInvite>(
            createInvite({ kind: "signup" }),
        );

        expect(
            (await accept(token, { username: "admin", password: "whatever1" }))
                .status,
        ).toBe(409);
        expect(
            (await accept(token, { username: "erin", password: "whatever1" }))
                .status,
        ).toBe(204);
    });

    it("resets a password and signs the user out", async () => {
        const bob = await app.signUp("bob");
        const { token } = await json<CreatedInvite>(
            createInvite({ kind: "password-reset", userId: bob.id }),
        );

        expect(
            await json<InviteInfo>(app.request(`/api/invites/${token}`)),
        ).toEqual({ kind: "password-reset", username: "bob" });

        expect((await accept(token, { password: "new-password" })).status).toBe(
            204,
        );
        expect((await bob.client("/api/categories")).status).toBe(401);
        await expect(app.login("bob")).rejects.toThrow();
        await app.login("bob", "new-password");
    });

    it("is admin-only to create", async () => {
        const { client } = await app.signUp("mallory");
        expect((await createInvite({ kind: "signup" }, client)).status).toBe(
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
