import type { IconName } from "lucide-react/dynamic";

/**
 * The colors offered for a category: one per hue family, mid tones, so the
 * MD3 tonal derivation (`paletteFromHex`) gives clearly different
 * containers. Existing colors off this list stay valid.
 */
export const CATEGORY_COLORS = [
    "#b3261e",
    "#d81b60",
    "#8e24aa",
    "#5e35b1",
    "#3949ab",
    "#1e88e5",
    "#039be5",
    "#00acc1",
    "#00897b",
    "#43a047",
    "#7cb342",
    "#c0ca33",
    "#fdd835",
    "#fb8c00",
    "#6d4c41",
    "#757575",
];

interface CategoryIcon {
    name: IconName;

    /**
     * Search terms besides the (English) icon name, in German.
     */
    keywords: string;
}

/**
 * The icons offered for a category.
 */
const CATEGORY_ICONS: CategoryIcon[] = [
    { name: "utensils", keywords: "essen restaurant besteck" },
    { name: "pizza", keywords: "essen lieferdienst" },
    { name: "coffee", keywords: "kaffee café" },
    { name: "beer", keywords: "bier bar getränke" },
    { name: "popcorn", keywords: "snacks kino" },
    { name: "shopping-basket", keywords: "einkäufe lebensmittel korb" },
    { name: "shopping-cart", keywords: "einkaufen supermarkt wagen" },
    { name: "gift", keywords: "geschenk" },
    { name: "heart", keywords: "herz gesundheit liebe" },
    { name: "heart-pulse", keywords: "gesundheit arzt puls" },
    { name: "pill", keywords: "medikamente apotheke" },
    { name: "dumbbell", keywords: "sport fitness" },
    { name: "shirt", keywords: "kleidung mode" },
    { name: "scissors", keywords: "friseur schere" },
    { name: "sparkles", keywords: "pflege kosmetik" },
    { name: "joystick", keywords: "freizeit spiele" },
    { name: "gamepad-2", keywords: "spiele games" },
    { name: "music", keywords: "musik konzert" },
    { name: "film", keywords: "kino filme streaming" },
    { name: "book-open", keywords: "bücher lesen" },
    { name: "graduation-cap", keywords: "bildung schule studium" },
    { name: "trophy", keywords: "hobby verein" },
    { name: "plane", keywords: "urlaub reisen flug" },
    { name: "tree-palm", keywords: "urlaub strand" },
    { name: "car", keywords: "auto" },
    { name: "fuel", keywords: "tanken benzin" },
    { name: "bus", keywords: "öpnv nahverkehr" },
    { name: "train-front", keywords: "bahn zug" },
    { name: "bike", keywords: "fahrrad rad" },
    { name: "house", keywords: "haus wohnung miete" },
    { name: "sofa", keywords: "wohnung möbel einrichtung" },
    { name: "wrench", keywords: "reparatur werkzeug handwerk" },
    { name: "zap", keywords: "strom energie" },
    { name: "wifi", keywords: "internet" },
    { name: "smartphone", keywords: "handy telefon" },
    { name: "laptop", keywords: "computer technik" },
    { name: "lamp-desk", keywords: "büro arbeit" },
    { name: "briefcase", keywords: "arbeit job" },
    { name: "baby", keywords: "kind kinder" },
    { name: "paw-print", keywords: "haustier tier" },
    { name: "dog", keywords: "hund haustier" },
    { name: "cat", keywords: "katze haustier" },
    { name: "receipt", keywords: "rechnung beleg gebühren" },
    { name: "landmark", keywords: "bank amt steuern" },
    { name: "wallet", keywords: "geldbörse bargeld" },
    { name: "banknote", keywords: "geld bargeld" },
    { name: "piggy-bank", keywords: "sparen sparschwein" },
    { name: "hand-coins", keywords: "einnahme geld zahlung" },
    { name: "undo-2", keywords: "erstattung rückzahlung" },
    { name: "circle-ellipsis", keywords: "sonstiges andere" },
];

/**
 * The offered icons matching `search` (by name or keyword), in list order.
 */
export function searchCategoryIcons(search: string): CategoryIcon[] {
    const terms = search.trim().toLocaleLowerCase().split(/\s+/);
    return CATEGORY_ICONS.filter((icon) => {
        const text = `${icon.name} ${icon.keywords}`;
        return terms.every((term) => text.includes(term));
    });
}
