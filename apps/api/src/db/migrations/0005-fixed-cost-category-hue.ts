import { type Kysely, sql } from "kysely";
import { initialHue } from "@finances/shared";

export async function up(db: Kysely<unknown>): Promise<void> {
    await sql`
        alter table fixed_cost_categories
            add column hue INTEGER not null default 0
                check (hue between 0 and 359)`.execute(db);

    const { rows } = await sql<{ user_id: string; id: string }>`
        select user_id, id
        from fixed_cost_categories
        order by user_id, id`.execute(db);
    const indexes = new Map<string, number>();
    for (const row of rows) {
        const index = indexes.get(row.user_id) ?? 0;
        indexes.set(row.user_id, index + 1);
        await sql`
            update fixed_cost_categories
            set hue = ${initialHue(row.id, index)}
            where user_id = ${row.user_id}
              and id = ${row.id}`.execute(db);
    }
}
