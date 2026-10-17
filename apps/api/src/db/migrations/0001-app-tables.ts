import { type Kysely, sql } from "kysely";

// Runs after the better-auth tables exist, since everything references "user".
export async function up(db: Kysely<unknown>): Promise<void> {
    await sql`
        create table categories
        (
            user_id   TEXT not null references "user" (id) on delete cascade,
            id        TEXT not null,
            name      TEXT not null,
            color     TEXT not null,
            icon_name TEXT not null,
            primary key (user_id, id),
            unique (user_id, name),
            unique (user_id, color),
            unique (user_id, icon_name)
        )`.execute(db);

    await sql`
        create table fixed_cost_categories
        (
            user_id     TEXT not null references "user" (id) on delete cascade,
            id          TEXT not null,
            name        TEXT not null,
            description TEXT default null,
            primary key (user_id, id),
            unique (user_id, name)
        )`.execute(db);

    await sql`
        create table transactions
        (
            user_id     TEXT    not null references "user" (id) on delete cascade,
            id          TEXT    not null,
            date        INTEGER not null,
            name        TEXT    not null,
            description TEXT    default null,
            kind        TEXT    not null check (kind in ('expense', 'income')),
            amount      NUMERIC not null check (amount >= 0),
            currency    TEXT    not null,
            category_id TEXT    not null,
            exceptional INTEGER not null default 0 check (exceptional in (0, 1)),
            updated_at  INTEGER not null,
            primary key (user_id, id),
            foreign key (user_id, category_id) references categories (user_id, id)
                on update cascade on delete restrict
        )`.execute(db);

    await sql`create index transactions_user_date on transactions (user_id, date)`.execute(
        db,
    );

    await sql`
        create table transaction_tombstones
        (
            user_id    TEXT    not null references "user" (id) on delete cascade,
            id         TEXT    not null,
            deleted_at INTEGER not null,
            primary key (user_id, id)
        )`.execute(db);

    await sql`
        create table fixed_costs
        (
            user_id     TEXT    not null references "user" (id) on delete cascade,
            id          TEXT    not null,
            name        TEXT    not null,
            description TEXT    default null,
            amount      NUMERIC not null check (amount >= 0),
            currency    TEXT    not null default 'EUR',
            interval    TEXT    not null default 'monthly'
                check (interval in ('monthly', 'quarterly', 'yearly')),
            category_id TEXT    not null,
            active      INTEGER not null default 1 check (active in (0, 1)),
            start_date  TEXT    not null,
            end_date    TEXT    default null,
            primary key (user_id, id),
            foreign key (user_id, category_id) references fixed_cost_categories (user_id, id)
                on update cascade on delete restrict
        )`.execute(db);

    await sql`
        create table invites
        (
            token_hash TEXT    not null primary key,
            kind       TEXT    not null check (kind in ('signup', 'password-reset')),
            user_id    TEXT    default null references "user" (id) on delete cascade,
            created_by TEXT    default null references "user" (id) on delete set null,
            created_at INTEGER not null,
            expires_at INTEGER not null,
            used_at    INTEGER default null,
            check (kind = 'signup' or user_id is not null)
        )`.execute(db);
}
