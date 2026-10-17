import type { Command } from "commander";
import { createPasswordResetLink } from "../../features/links.ts";
import { type CommandContext, linkUrl, type RunCommand } from "../command.ts";

export async function resetPassword(
    { db, baseURL, out }: CommandContext,
    username: string,
): Promise<number> {
    const user = await db
        .selectFrom("user")
        .select("id")
        .where("username", "=", username.toLowerCase())
        .executeTakeFirst();
    const link = user && (await createPasswordResetLink(db, user.id, null));
    if (!link) {
        out.error(`No user named "${username}". See \`finances users\`.`);
        return 1;
    }

    out.info(linkUrl(baseURL, link.token));
    out.info(`Valid once, until ${new Date(link.expiresAt).toLocaleString()}.`);
    return 0;
}

export function registerResetPassword(program: Command, run: RunCommand) {
    program
        .command("reset-password")
        .description("create a password reset link for an existing user")
        .argument("<username>")
        .action((username: string) =>
            run((context) => resetPassword(context, username)),
        );
}
