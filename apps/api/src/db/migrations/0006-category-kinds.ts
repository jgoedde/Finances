import { type Kysely, sql } from "kysely";

// Frozen copy of `FALLBACK_CATEGORIES` at the time of this migration.
const FALLBACK_CATEGORIES = {
    expense: {
        id: "fallback-expense",
        kind: "expense",
        color: "#7c7c7c",
        iconName: "circle-ellipsis",
    },
    income: {
        id: "fallback-income",
        kind: "income",
        color: "#3f8f6b",
        iconName: "hand-coins",
    },
} as const;

/**
 * Categories get a kind and every user a fallback category per kind. The
 * existing categories become expense categories and all incomes move onto
 * the income fallback category.
 *
 * SQLite can't change constraints in place, so the table is rebuilt (see
 * https://sqlite.org/lang_altertable.html#otheralter). Foreign keys are off
 * meanwhile, or dropping the old table would trip the transactions'
 * references.
 */
export async function up(db: Kysely<unknown>): Promise<void> {
    await sql`pragma foreign_keys = off`.execute(db);
    try {
        await db.transaction().execute(async (trx) => {
            await sql`
                create table categories_new
                (
                    user_id   TEXT    not null references "user" (id) on delete cascade,
                    id        TEXT    not null,
                    kind      TEXT    not null check (kind in ('expense', 'income')),
                    fallback  INTEGER not null default 0 check (fallback in (0, 1)),
                    name      TEXT    default null,
                    color     TEXT    not null,
                    icon_name TEXT    not null,
                    primary key (user_id, id),
                    -- A fallback category is shown through the translation.
                    check ((fallback = 1) = (name is null))
                )`.execute(trx);
            await sql`
                insert into categories_new (user_id, id, kind, name, color, icon_name)
                select user_id, id, 'expense', name, color, icon_name
                from categories`.execute(trx);
            await sql`drop table categories`.execute(trx);
            await sql`alter table categories_new rename to categories`.execute(
                trx,
            );

            // Fallback categories have no name (and nulls are distinct) and
            // may share a color or icon with an ordinary category.
            await sql`
                create unique index categories_name
                    on categories (user_id, kind, name)`.execute(trx);
            await sql`
                create unique index categories_fallback
                    on categories (user_id, kind) where fallback = 1`.execute(
                trx,
            );
            await sql`
                create unique index categories_color
                    on categories (user_id, color) where fallback = 0`.execute(
                trx,
            );
            await sql`
                create unique index categories_icon_name
                    on categories (user_id, icon_name) where fallback = 0`.execute(
                trx,
            );

            for (const fallback of Object.values(FALLBACK_CATEGORIES)) {
                await sql`
                    insert into categories (user_id, id, kind, fallback, color, icon_name)
                    select id, ${fallback.id}, ${fallback.kind}, 1, ${fallback.color}, ${fallback.iconName}
                    from "user"`.execute(trx);
            }
            await sql`
                update transactions
                set category_id = ${FALLBACK_CATEGORIES.income.id}
                where kind = 'income'`.execute(trx);

            const { rows } = await sql`pragma foreign_key_check`.execute(trx);
            if (rows.length > 0) {
                throw new Error("Foreign key violations after rebuild");
            }
        });
    } finally {
        await sql`pragma foreign_keys = on`.execute(db);
    }
}
