// Must stay the first import: it routes logs to stderr before the logger is
// created, so stdout only carries command output (e.g. a backup).
import "./log-to-stderr.ts";
import { Command } from "commander";
import { openMigratedDatabase } from "../bootstrap.ts";
import type { Output, RunCommand } from "./command.ts";
import { registerBackup } from "./commands/backup.ts";
import { registerInvite } from "./commands/invite.ts";
import { registerResetPassword } from "./commands/reset-password.ts";
import { registerRestore } from "./commands/restore.ts";
import { registerUsers } from "./commands/users.ts";

// Operator CLI. Talks to the SQLite database directly, so it works whether or
// not the server is running.

const consoleOutput: Output = {
    info: (line) => console.log(line),
    error: (line) => console.error(line),
};

const run: RunCommand = async (action) => {
    const { db, databasePath, authConfig } = await openMigratedDatabase();
    try {
        process.exitCode = await action({
            db,
            databasePath,
            baseURL: authConfig.baseURL,
            out: consoleOutput,
        });
    } finally {
        await db.destroy();
    }
};

const program = new Command("finances").description(
    "Operator commands for a Finances instance",
);
registerInvite(program, run);
registerResetPassword(program, run);
registerUsers(program, run);
registerBackup(program, run);
registerRestore(program, run);

await program.parseAsync();
