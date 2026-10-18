import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import type { Database } from "./schema.ts";

export type DB = Kysely<Database>;

/**
 * Opens the SQLite database. Pass `":memory:"` for tests.
 */
export function openDatabase(filename: string): DB {
    const sqlite = new SQLite(filename);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    return new Kysely<Database>({
        dialect: new SqliteDialect({ database: sqlite }),
    });
}
