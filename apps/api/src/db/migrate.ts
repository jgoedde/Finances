import { type Migration, Migrator } from "kysely/migration";
import { getMigrations } from "better-auth/db/migration";
import type { DB } from "./database.ts";
import type { BetterAuthOptions } from "better-auth";
import { logger } from "../log.ts";
import { up as appTables } from "./migrations/0001-app-tables.ts";

// Append new migrations here. Never edit or reorder applied ones.
const migrations: Record<string, Migration> = {
    "0001-app-tables": { up: appTables },
};

/**
 * Our migrations known to this version, in order.
 */
export const migrationNames = Object.keys(migrations);

/**
 * Brings the schema up to date: first better-auth's own tables (diffed by
 * better-auth), then our versioned migrations.
 */
export async function migrate(
    db: DB,
    authOptions: BetterAuthOptions,
): Promise<void> {
    const { toBeCreated, toBeAdded, runMigrations } =
        await getMigrations(authOptions);
    if (toBeCreated.length > 0 || toBeAdded.length > 0) {
        logger.info(
            {
                created: toBeCreated.map((t) => t.table),
                altered: toBeAdded.map((t) => t.table),
            },
            "Migrating better-auth tables",
        );
    }
    await runMigrations();

    const migrator = new Migrator({
        db,
        provider: { getMigrations: () => Promise.resolve(migrations) },
    });
    const { error, results = [] } = await migrator.migrateToLatest();
    for (const result of results) {
        if (result.status === "Success") {
            logger.info(
                { migration: result.migrationName },
                "Applied migration",
            );
        } else {
            logger.error(
                { migration: result.migrationName, status: result.status },
                "Migration not applied",
            );
        }
    }
    if (error) {
        throw error instanceof Error
            ? error
            : new Error("Migration failed", { cause: error });
    }
}
