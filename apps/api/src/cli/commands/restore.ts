import { createWriteStream } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import SQLite from "better-sqlite3";
import type { Command } from "commander";
import { migrationNames } from "#/db/migrate.ts";
import type { CommandContext, RunCommand } from "../command.ts";

/** Why the snapshot can't be restored, or undefined if it can. */
function checkSnapshot(snapshot: SQLite.Database): string | undefined {
    let integrity: unknown;
    try {
        integrity = snapshot.pragma("quick_check", { simple: true });
    } catch {
        return "The input is not an SQLite database.";
    }
    if (integrity !== "ok") {
        return "The backup is corrupt.";
    }

    const tables = new Set(
        snapshot
            .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
            .pluck()
            .all(),
    );
    if (
        !["user", "transactions", "kysely_migration"].every((t) =>
            tables.has(t),
        )
    ) {
        return "The input is not a Finances backup.";
    }

    const applied = snapshot
        .prepare("SELECT name FROM kysely_migration")
        .pluck()
        .all() as string[];
    if (applied.some((name) => !migrationNames.includes(name))) {
        return "The backup is from a newer version of Finances. Update first.";
    }
    return undefined;
}

/** True if no user has transactions or fixed costs (as on a fresh instance). */
async function isEmpty({ db }: CommandContext): Promise<boolean> {
    const [transaction, fixedCost] = await Promise.all([
        db.selectFrom("transactions").select("id").limit(1).executeTakeFirst(),
        db.selectFrom("fixed_costs").select("id").limit(1).executeTakeFirst(),
    ]);
    return transaction === undefined && fixedCost === undefined;
}

/**
 * Replaces the whole database with a snapshot from `input` (see `backup`).
 * Only into an empty instance, unless `force` confirms the server is stopped.
 */
export async function restore(
    context: CommandContext,
    input: Readable & { isTTY?: boolean },
    { force }: { force: boolean },
): Promise<number> {
    const { databasePath, out } = context;
    if (input.isTTY) {
        out.error("Pipe a backup into stdin: `finances restore < backup.db`.");
        return 1;
    }
    if (!force && !(await isEmpty(context))) {
        out.error(
            "This instance already has data. Stop the server, then run `finances restore --force`.",
        );
        return 1;
    }

    const dir = await mkdtemp(join(tmpdir(), "finances-restore-"));
    try {
        const file = join(dir, "backup.db");
        await pipeline(input, createWriteStream(file));

        const snapshot = new SQLite(file, { readonly: true });
        try {
            const problem = checkSnapshot(snapshot);
            if (problem) {
                out.error(problem);
                return 1;
            }
            // SQLite's backup API: replaces the pages in place, so open
            // connections (this one, a running server) see the new data.
            await snapshot.backup(databasePath);
        } finally {
            snapshot.close();
        }
    } finally {
        await rm(dir, { recursive: true, force: true });
    }

    out.info("Restored. Restart the server to apply pending migrations.");
    return 0;
}

export function registerRestore(program: Command, run: RunCommand) {
    program
        .command("restore")
        .description(
            "replace the database with a backup from stdin (empty instance or stopped server only)",
        )
        .option(
            "--force",
            "replace an instance that has data; stop the server first",
        )
        .action((options: { force?: boolean }) =>
            run((context) =>
                restore(context, process.stdin, {
                    force: options.force === true,
                }),
            ),
        );
}
