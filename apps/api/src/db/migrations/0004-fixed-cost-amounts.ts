import { type Kysely, sql } from "kysely";

// Fixed costs get an amount history, and `active` gives way to the end date:
// inactive fixed costs end today (UTC) at the latest.
export async function up(db: Kysely<unknown>): Promise<void> {
    await sql`
        create table fixed_cost_amounts
        (
            user_id       TEXT    not null,
            fixed_cost_id TEXT    not null,
            valid_from    TEXT    not null,
            amount        NUMERIC not null check (amount >= 0),
            interval      TEXT    not null
                check (interval in ('monthly', 'quarterly', 'yearly')),
            primary key (user_id, fixed_cost_id, valid_from),
            foreign key (user_id, fixed_cost_id) references fixed_costs (user_id, id)
                on update cascade on delete cascade
        )`.execute(db);

    await sql`
        insert into fixed_cost_amounts (user_id, fixed_cost_id, valid_from, amount, interval)
        select user_id, id, start_date, amount, interval
        from fixed_costs`.execute(db);

    const today = new Date().toISOString().slice(0, 10);
    await sql`
        update fixed_costs
        set end_date = min(coalesce(end_date, ${today}), ${today})
        where active = 0`.execute(db);

    for (const column of ["amount", "interval", "active"]) {
        await sql`alter table fixed_costs drop column ${sql.ref(column)}`.execute(
            db,
        );
    }
}
