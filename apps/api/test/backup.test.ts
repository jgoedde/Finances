import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PassThrough, Readable } from "node:stream";
import type { Transaction } from "@finances/shared";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { CommandContext } from "#/cli/command.ts";
import { backup } from "#/cli/commands/backup.ts";
import { restore } from "#/cli/commands/restore.ts";
import { createTestApp, json, transactionBody } from "./test-app.ts";

describe("backup and restore", () => {
    let dir: string;
    let errors: string[];

    beforeEach(async () => {
        dir = await mkdtemp(join(tmpdir(), "finances-test-"));
        errors = [];
    });

    afterEach(async () => {
        await rm(dir, { recursive: true, force: true });
    });

    /**
     * A file-backed app and a CLI context for it.
     */
    async function instance(name: string) {
        const databasePath = join(dir, `${name}.db`);
        const app = await createTestApp({ filename: databasePath });
        const context: CommandContext = {
            db: app.db,
            databasePath,
            baseURL: "https://finances.example.com",
            out: { info: () => {}, error: (line) => errors.push(line) },
        };
        return { app, context };
    }

    async function takeBackup(context: CommandContext): Promise<Buffer> {
        const output = new PassThrough();
        const chunks: Buffer[] = [];
        output.on("data", (chunk: Buffer) => chunks.push(chunk));
        expect(await backup(context, output)).toBe(0);
        return Buffer.concat(chunks);
    }

    async function withAliceData() {
        const source = await instance("source");
        const { client } = await source.app.signUp("alice");
        await client("/api/transactions/t1", {
            method: "PUT",
            body: transactionBody({ name: "Brot" }),
        });
        return source;
    }

    it("restores a backup into an empty instance, users included", async () => {
        const source = await withAliceData();
        const snapshot = await takeBackup(source.context);

        const target = await instance("target");
        expect(
            await restore(target.context, Readable.from([snapshot]), {
                force: false,
            }),
        ).toBe(0);

        // The open connection sees the restored data; alice can sign in.
        const client = await target.app.login("alice");
        const restored = await json<Transaction>(
            client("/api/transactions/t1"),
        );
        expect(restored.name).toBe("Brot");
    });

    it("only replaces an instance with data when forced", async () => {
        const source = await withAliceData();
        const snapshot = await takeBackup(source.context);

        expect(
            await restore(source.context, Readable.from([snapshot]), {
                force: false,
            }),
        ).toBe(1);
        expect(errors[0]).toContain("--force");

        expect(
            await restore(source.context, Readable.from([snapshot]), {
                force: true,
            }),
        ).toBe(0);
    });

    it("rejects input that isn't a Finances backup", async () => {
        const target = await instance("target");
        expect(
            await restore(
                target.context,
                Readable.from([Buffer.from("not a database")]),
                { force: false },
            ),
        ).toBe(1);
        expect(errors[0]).toBe("The input is not an SQLite database.");
    });

    it("refuses to write a backup to a terminal", async () => {
        const { context } = await instance("source");
        const terminal = Object.assign(new PassThrough(), { isTTY: true });
        expect(await backup(context, terminal)).toBe(1);
    });
});
