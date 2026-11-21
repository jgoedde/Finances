import { type Kysely, sql } from "kysely";

/**
 * Attached expenses reference their main expense (ADR 0008).
 */
export async function up(db: Kysely<unknown>): Promise<void> {
    await sql`alter table transactions add column main_expense_id TEXT default null`.execute(
        db,
    );
    await sql`create index transactions_main_expense on transactions (user_id, main_expense_id)`.execute(
        db,
    );
}
