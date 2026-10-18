import {
    defineCustomClientStrategy,
    isLocale,
    type Locale,
} from "#/paraglide/runtime.js";

// The language chosen in the settings, else the browser's: German for de*,
// English otherwise. Paraglide's own localStorage strategy would store the
// first detected language as if chosen, so the browser's would no longer
// count; this one only stores an explicit choice. Must run before the first
// message renders, so main.tsx imports it first.

const STORAGE_KEY = "finances-locale";

function storedLocale(): Locale | undefined {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return isLocale(stored) ? stored : undefined;
    } catch {
        return undefined;
    }
}

defineCustomClientStrategy("custom-device", {
    getLocale: () =>
        storedLocale() ??
        (navigator.language.toLowerCase().startsWith("de") ? "de" : "en"),
    // Paraglide also calls this with the detected locale; see chooseLocale.
    setLocale: () => undefined,
});

/** Saves the language for this device and reloads the app in it. */
export function chooseLocale(locale: Locale): void {
    try {
        localStorage.setItem(STORAGE_KEY, locale);
    } catch {
        // Storage blocked: the choice only lasts until the next start.
    }
    window.location.reload();
}
