import type { Command } from "commander";
import type { CommandContext, RunCommand } from "../command.ts";

export async function users({ db, out }: CommandContext): Promise<number> {
    const rows = await db
        .selectFrom("user")
        .select(["username", "role", "createdAt"])
        .orderBy("createdAt")
        .execute();
    if (rows.length === 0) {
        out.info("No users yet. Create one with `finances invite`.");
        return 0;
    }

    const table = [
        ["USERNAME", "ROLE", "CREATED"],
        ...rows.map((row) => [
            row.username ?? "",
            row.role ?? "user",
            row.createdAt.slice(0, 10),
        ]),
    ];
    const widths = [0, 1].map((column) =>
        Math.max(...table.map((cells) => cells[column]?.length ?? 0)),
    );
    for (const [username = "", role = "", created = ""] of table) {
        out.info(
            [
                username.padEnd(widths[0] ?? 0),
                role.padEnd(widths[1] ?? 0),
                created,
            ].join("  "),
        );
    }
    return 0;
}

export function registerUsers(program: Command, run: RunCommand) {
    program
        .command("users")
        .description("list all users")
        .action(() => run(users));
}
