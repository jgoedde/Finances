import { type Migration, Migrator } from "kysely/migration";
import { getMigrations } from "better-auth/db/migration";
import type { DB } from "./database.ts";
import type { BetterAuthOptions } from "better-auth";
import { up as appTables } from "./migrations/0001-app-tables.ts";

// Append new migrations here. Never edit or reorder applied ones.
const migrations: Record<string, Migration> = {
    "0001-app-tables": { up: appTables },
};

/**
 * Brings the schema up to date: first better-auth's own tables (diffed by
 * better-auth), then our versioned migrations.
 */
export async function migrate(
    db: DB,
    authOptions: BetterAuthOptions,
): Promise<void> {
    const { runMigrations } = await getMigrations(authOptions);
    await runMigrations();

    const migrator = new Migrator({
        db,
        provider: { getMigrations: async () => migrations },
    });
    const { error } = await migrator.migrateToLatest();
    if (error) {
        throw error;
    }
}
