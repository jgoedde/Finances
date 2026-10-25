import { initialHue } from "@finances/shared";
import type { DB } from "./database.ts";

// Defaults every new user starts with. Ids match the legacy client-side
// database so imported data maps onto them.
const DEFAULT_CATEGORIES = [
    {
        id: "1",
        name: "Auswärts essen",
        color: "#00202e",
        icon_name: "utensils",
    },
    {
        id: "2",
        name: "Einkäufe",
        color: "#2c4875",
        icon_name: "shopping-basket",
    },
    { id: "3", name: "Geschenke", color: "#8a508f", icon_name: "gift" },
    { id: "4", name: "Gesundheit", color: "#bc5090", icon_name: "heart" },
    { id: "5", name: "Kleidung", color: "#ff8531", icon_name: "shirt" },
    { id: "6", name: "Freizeit", color: "#ffa600", icon_name: "joystick" },
    { id: "7", name: "Urlaub", color: "#80d353", icon_name: "plane" },
    { id: "8", name: "Büro/Arbeit", color: "#609f3f", icon_name: "lamp-desk" },
    { id: "9", name: "Snacks", color: "#D8DC6A", icon_name: "popcorn" },
    { id: "10", name: "Wohnung", color: "#ff6361", icon_name: "sofa" },
];

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

export async function seedUserData(db: DB, userId: string): Promise<void> {
    await db.transaction().execute(async (trx) => {
        await trx
            .insertInto("categories")
            .values(DEFAULT_CATEGORIES.map((c) => ({ ...c, user_id: userId })))
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
