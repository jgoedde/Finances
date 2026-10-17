import { Command } from "commander";
import { openMigratedDatabase } from "../bootstrap.ts";
import type { Output, RunCommand } from "./command.ts";
import { registerInvite } from "./commands/invite.ts";
import { registerResetPassword } from "./commands/reset-password.ts";
import { registerUsers } from "./commands/users.ts";

// Operator CLI. Talks to the SQLite database directly, so it works whether or
// not the server is running.

const consoleOutput: Output = {
    info: (line) => console.log(line),
    error: (line) => console.error(line),
};

const run: RunCommand = async (action) => {
    const { db, authConfig } = await openMigratedDatabase();
    try {
        process.exitCode = await action({
            db,
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

await program.parseAsync();
