import { type AuthConfig, authOptions, createAuth } from "./auth/auth.ts";
import { openDatabase } from "./db/database.ts";
import { migrate } from "./db/migrate.ts";

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable ${name}`);
    }
    return value;
}

function readAuthConfig(): AuthConfig {
    return {
        secret: requireEnv("BETTER_AUTH_SECRET"),
        baseURL: requireEnv("BASE_URL"),
        trustedOrigins:
            process.env.TRUSTED_ORIGINS?.split(",")
                .map((origin) => origin.trim())
                .filter(Boolean) ?? [],
    };
}

/** Opens and migrates the database. */
export async function openMigratedDatabase() {
    const databasePath = process.env.DATABASE_PATH ?? "/data/finances.db";
    const db = openDatabase(databasePath);
    const authConfig = readAuthConfig();
    await migrate(db, authOptions(db, authConfig));
    return { db, databasePath, authConfig };
}

/** Opens and migrates the database, then creates the auth instance. */
export async function bootstrap() {
    const { db, authConfig } = await openMigratedDatabase();
    return { db, auth: createAuth(db, authConfig) };
}
