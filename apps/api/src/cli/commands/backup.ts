import { createReadStream } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { Command } from "commander";
import { sql } from "kysely";
import type { CommandContext, RunCommand } from "../command.ts";

/**
 * Writes a consistent snapshot of the database (`VACUUM INTO`) to `output`.
 * Safe while the server is running.
 */
export async function backup(
    { db, out }: CommandContext,
    output: Writable & { isTTY?: boolean },
): Promise<number> {
    if (output.isTTY) {
        out.error(
            "Refusing to write a backup to the terminal. Redirect it: `finances backup > backup.db`.",
        );
        return 1;
    }

    const dir = await mkdtemp(join(tmpdir(), "finances-backup-"));
    try {
        const file = join(dir, "backup.db");
        await sql`VACUUM INTO ${file}`.execute(db);
        await pipeline(createReadStream(file), output, { end: false });
    } finally {
        await rm(dir, { recursive: true, force: true });
    }
    return 0;
}

export function registerBackup(program: Command, run: RunCommand) {
    program
        .command("backup")
        .description("write a consistent snapshot of the database to stdout")
        .action(() => run((context) => backup(context, process.stdout)));
}
