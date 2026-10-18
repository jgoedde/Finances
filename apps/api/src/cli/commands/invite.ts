import type { Command } from "commander";
import { createInvite } from "#/features/links/links.ts";
import { type CommandContext, linkUrl, type RunCommand } from "../command.ts";

export async function invite({
    db,
    baseURL,
    out,
}: CommandContext): Promise<number> {
    const link = await createInvite(db, null);
    out.info(linkUrl(baseURL, link.token));
    out.info(`Valid once, until ${new Date(link.expiresAt).toLocaleString()}.`);
    return 0;
}

export function registerInvite(program: Command, run: RunCommand) {
    program
        .command("invite")
        .description("create an invite link for a new user")
        .action(() => run(invite));
}
