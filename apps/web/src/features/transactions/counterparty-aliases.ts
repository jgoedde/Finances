import { omit } from "lodash";
import { counterpartyKey } from "@finances/shared";

// What the user turned a raw counterparty (e.g. "ALDI NORD 1234 HAMBURG"
// from a card statement) into, applied the next time the same raw name comes
// in. Per device in localStorage; it belongs to the signed-in user and is
// cleared on sign-out or when another user signs in.
const STORAGE_KEY = "finances-counterparty-aliases";

function load(): Record<string, string> {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? (JSON.parse(stored) as Record<string, string>) : {};
    } catch {
        return {};
    }
}

function store(aliases: Record<string, string>): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(aliases));
    } catch {
        // Only a convenience; the form works without it.
    }
}

export const counterpartyAliases = {
    get(raw: string): string | undefined {
        return load()[counterpartyKey(raw)];
    },
    set(raw: string, name: string): void {
        store({ ...load(), [counterpartyKey(raw)]: name });
    },
    remove(raw: string): void {
        store(omit(load(), counterpartyKey(raw)));
    },
    clear(): void {
        store({});
    },
};
