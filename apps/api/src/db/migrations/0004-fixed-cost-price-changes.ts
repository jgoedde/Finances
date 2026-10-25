import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
    await sql`alter table fixed_costs rename column amount to initial_amount`.execute(
        db,
    );

    await sql`
        create table fixed_cost_price_changes
        (
            user_id       TEXT    not null,
            fixed_cost_id TEXT    not null,
            date          TEXT    not null,
            amount        NUMERIC not null check (amount >= 0),
            primary key (user_id, fixed_cost_id, date),
            foreign key (user_id, fixed_cost_id) references fixed_costs (user_id, id)
                on delete cascade
        )`.execute(db);
}
