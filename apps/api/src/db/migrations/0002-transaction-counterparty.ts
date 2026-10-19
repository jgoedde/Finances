import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
    await sql`alter table transactions rename column name to counterparty`.execute(
        db,
    );
}
