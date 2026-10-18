import { useSyncExternalStore } from "react";
import type { Transaction } from "@finances/shared";

/**
 * A pending change the server rejected. Kept until retried or discarded.
 */
export interface SyncFailure {
    id: string;
    action: "save" | "delete";
    transaction: Transaction;

    /**
     * The API's answer, if the change reached it.
     */
    error?: { status: number; code?: string };

    /**
     * German reason text, stored by versions before the API codes.
     */
    reason?: string;
    failedAt: number;
}

// Persisted in localStorage so failures survive reloads; they belong to the
// signed-in user and are cleared on sign-out or when another user signs in.
const STORAGE_KEY = "finances-sync-failures";

function load(): SyncFailure[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? (JSON.parse(stored) as SyncFailure[]) : [];
    } catch {
        return [];
    }
}

let failures = load();
const listeners = new Set<() => void>();

function update(next: SyncFailure[]): void {
    failures = next;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    listeners.forEach((listener) => listener());
}

export const syncFailures = {
    add(failure: Omit<SyncFailure, "id" | "failedAt">): void {
        update([
            ...failures,
            { ...failure, id: crypto.randomUUID(), failedAt: Date.now() },
        ]);
    },
    remove(id: string): void {
        update(failures.filter((failure) => failure.id !== id));
    },
    clear(): void {
        update([]);
    },
};

export function useSyncFailures(): SyncFailure[] {
    return useSyncExternalStore(
        (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        () => failures,
    );
}
