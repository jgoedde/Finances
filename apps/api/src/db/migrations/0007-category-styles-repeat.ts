import { type Kysely, sql } from "kysely";

/**
 * Users pick category colors and icons from a small palette, so several
 * categories may share one. Names stay unique per kind.
 */
export async function up(db: Kysely<unknown>): Promise<void> {
    await sql`drop index if exists categories_color`.execute(db);
    await sql`drop index if exists categories_icon_name`.execute(db);
}
