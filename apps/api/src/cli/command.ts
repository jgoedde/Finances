import type { DB } from "../db/database.ts";

export interface Output {
    info(line: string): void;
    error(line: string): void;
}

/**
 * What every command action gets: injected so actions are testable.
 */
export interface CommandContext {
    db: DB;
    /**
     * SQLite file behind `db`.
     */
    databasePath: string;
    /**
     * Public URL of the instance, used to build links.
     */
    baseURL: string;
    out: Output;
}

/**
 * Runs a command and resolves to its exit code.
 */
export type CommandAction = (context: CommandContext) => Promise<number>;

/**
 * Provides the context (database etc.) and applies the exit code.
 */
export type RunCommand = (action: CommandAction) => Promise<void>;

export function linkUrl(baseURL: string, token: string): string {
    return new URL(`/link/${token}`, baseURL).toString();
}
