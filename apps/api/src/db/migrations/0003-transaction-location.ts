import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
    for (const column of [
        "location_lat",
        "location_lng",
        "location_accuracy",
    ]) {
        await sql`alter table transactions add column ${sql.ref(column)} REAL default null`.execute(
            db,
        );
    }
}
