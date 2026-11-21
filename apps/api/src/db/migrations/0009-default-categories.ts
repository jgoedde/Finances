import { type Kysely, sql } from "kysely";

// Frozen copy of the categories new users got before this migration. Ids
// match the legacy client-side database so imported data maps onto them.
const INITIAL_DEFAULT_CATEGORIES = [
    ["1", "Auswärts essen", "#00202e", "utensils"],
    ["2", "Einkäufe", "#2c4875", "shopping-basket"],
    ["3", "Geschenke", "#8a508f", "gift"],
    ["4", "Gesundheit", "#bc5090", "heart"],
    ["5", "Kleidung", "#ff8531", "shirt"],
    ["6", "Freizeit", "#ffa600", "joystick"],
    ["7", "Urlaub", "#80d353", "plane"],
    ["8", "Büro/Arbeit", "#609f3f", "lamp-desk"],
    ["9", "Snacks", "#D8DC6A", "popcorn"],
    ["10", "Wohnung", "#ff6361", "sofa"],
] as const;

/**
 * Admin-maintained default categories, copied to every new user (ADR 0007).
 * Instance-wide, so not keyed by user.
 */
export async function up(db: Kysely<unknown>): Promise<void> {
    await db.transaction().execute(async (trx) => {
        await sql`
            create table default_categories
            (
                id        TEXT not null primary key,
                kind      TEXT not null check (kind in ('expense', 'income')),
                name      TEXT not null,
                color     TEXT not null,
                icon_name TEXT not null,
                unique (kind, name)
            )`.execute(trx);
        for (const [id, name, color, iconName] of INITIAL_DEFAULT_CATEGORIES) {
            await sql`
                insert into default_categories (id, kind, name, color, icon_name)
                values (${id}, 'expense', ${name}, ${color}, ${iconName})`.execute(
                trx,
            );
        }
    });
}
