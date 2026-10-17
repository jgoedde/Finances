import { beforeEach, describe, expect, it } from "vitest";
import type { LinkInfo } from "@finances/shared";
import type { CommandContext } from "#/cli/command.ts";
import { invite } from "#/cli/commands/invite.ts";
import { resetPassword } from "#/cli/commands/reset-password.ts";
import { users } from "#/cli/commands/users.ts";
import { createTestApp, json } from "./test-app.ts";

const BASE_URL = "https://finances.example.com";

describe("cli", () => {
    let app: Awaited<ReturnType<typeof createTestApp>>;
    let context: CommandContext;
    let info: string[];
    let errors: string[];

    beforeEach(async () => {
        app = await createTestApp();
        info = [];
        errors = [];
        context = {
            db: app.db,
            databasePath: ":memory:",
            baseURL: BASE_URL,
            out: {
                info: (line) => info.push(line),
                error: (line) => errors.push(line),
            },
        };
    });

    /** The token from a printed link, checked against the API. */
    async function linkInfo(url: string | undefined) {
        const token = url?.replace(`${BASE_URL}/link/`, "");
        return json<LinkInfo>(app.request(`/api/links/${token}`));
    }

    it("invite prints a working invite link", async () => {
        expect(await invite(context)).toBe(0);
        expect(info[0]).toMatch(`${BASE_URL}/link/`);
        expect(await linkInfo(info[0])).toEqual({
            kind: "invite",
            username: null,
        });
    });

    it("reset-password prints a link for that user", async () => {
        await app.signUp("bob");
        expect(await resetPassword(context, "Bob")).toBe(0);
        expect(await linkInfo(info[0])).toEqual({
            kind: "password-reset",
            username: "bob",
        });
    });

    it("reset-password fails for an unknown user", async () => {
        expect(await resetPassword(context, "ghost")).toBe(1);
        expect(info).toEqual([]);
        expect(errors[0]).toContain('"ghost"');
    });

    it("users lists usernames and roles", async () => {
        await app.signUp("admin", "admin");
        await app.signUp("bob");
        expect(await users(context)).toBe(0);
        expect(info[0]).toMatch(/^USERNAME\s+ROLE\s+CREATED$/);
        expect(info[1]).toMatch(/^admin\s+admin\s+\d{4}-\d{2}-\d{2}$/);
        expect(info[2]).toMatch(/^bob\s+user\s+\d{4}-\d{2}-\d{2}$/);
    });
});
