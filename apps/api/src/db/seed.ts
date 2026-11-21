import { FALLBACK_CATEGORIES, initialHue } from "@finances/shared";
import type { DB } from "./database.ts";
import { toCategoryColumns } from "#/features/categories/categories.ts";

const DEFAULT_FIXED_COST_CATEGORIES = [
    { id: "1", name: "Miete / Wohnung", description: "inkl. Nebenkosten" },
    { id: "2", name: "Strom & Heizung", description: null },
    { id: "3", name: "Wasser / Abwasser", description: null },
    { id: "4", name: "Internet & Festnetz", description: null },
    { id: "5", name: "Mobilfunk / Handyvertrag", description: null },
    {
        id: "6",
        name: "Rundfunkbeitrag / TV-Streaming-Abos",
        description: "z. B. Netflix",
    },
    {
        id: "7",
        name: "Versicherungen",
        description: "Hausrat, Haftpflicht, KFZ, Gesundheit Zusatz",
    },
    {
        id: "8",
        name: "Kredit / Darlehensraten",
        description: "inkl. Ratenkäufe",
    },
    {
        id: "9",
        name: "ÖPNV-/Auto-Fixkosten",
        description: "z. B. Leasing, Kfz-Steuer, feste Monatskarten",
    },
    {
        id: "10",
        name: "Abos & Mitgliedschaften",
        description: "Fitnessstudio, Zeitschriften, Software",
    },
    {
        id: "11",
        name: "Gebühren & Beiträge",
        description: "Kontoführungsgebühren, GEZ-ähnliches",
    },
    {
        id: "12",
        name: "Sonstige wiederkehrende Verträge",
        description: "z. B. Wartungsverträge, Sicherheitsdienste",
    },
];

/**
 * Gives a new user a copy of every default category (under the same id) and
 * both fallback categories, plus the fixed cost categories. The copies stay
 * independent of the defaults (ADR 0007).
 */
export async function seedUserData(db: DB, userId: string): Promise<void> {
    await db.transaction().execute(async (trx) => {
        const defaults = await trx
            .selectFrom("default_categories")
            .selectAll()
            .execute();
        await trx
            .insertInto("categories")
            .values([
                ...defaults.map((c) => ({
                    ...c,
                    fallback: 0 as const,
                    user_id: userId,
                })),
                ...Object.values(FALLBACK_CATEGORIES).map((c) =>
                    toCategoryColumns(userId, c),
                ),
            ])
            .execute();
        await trx
            .insertInto("fixed_cost_categories")
            .values(
                DEFAULT_FIXED_COST_CATEGORIES.map((c, index) => ({
                    ...c,
                    hue: initialHue(c.id, index),
                    user_id: userId,
                })),
            )
            .execute();
    });
}
