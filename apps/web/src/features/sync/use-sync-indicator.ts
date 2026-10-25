import { useEffect, useEffectEvent, useState } from "react";
import { onlineManager, useQueryClient } from "@tanstack/react-query";
import { syncFailures } from "#/features/sync/sync-failures.ts";
import { TRANSACTION_MUTATION_KEY } from "#/features/transactions/pending-changes.ts";

type SyncOutcome = "synced" | "rejected";

/**
 * What the sync indicator shows, or null while hidden.
 */
export interface SyncIndicatorState {
    outcome: SyncOutcome;

    /**
     * Synced changes, or all current sync failures when rejected.
     */
    count: number;

    /**
     * Fading out, right before it hides.
     */
    isFading: boolean;
}

const VISIBLE_MS = {
    synced: 3000,
    rejected: 6000,
} as const satisfies Record<SyncOutcome, number>;

const FADE_MS = 500;

/**
 * The time from the first pending change until the queue is empty again.
 */
interface SyncPeriod {
    changes: Set<number>;

    /**
     * Sync failures that existed before, by id.
     */
    failuresBefore: Set<string>;

    /**
     * The app was offline or a request had to be retried at some point.
     */
    wasDisrupted: boolean;
}

interface UseSyncIndicatorOptions {
    /**
     * Called for every sync that ends with sync failures.
     *
     * @param count all current sync failures
     */
    onRejected: (count: number) => void;
}

/**
 * Reports when pending changes have been synced after the app was offline
 * or requests had to be retried, and whenever the server rejects changes.
 * Normal successful online saves report nothing.
 */
export function useSyncIndicator({
    onRejected,
}: UseSyncIndicatorOptions): SyncIndicatorState | null {
    const queryClient = useQueryClient();
    const [state, setState] = useState<SyncIndicatorState | null>(null);
    const reportRejected = useEffectEvent(onRejected);

    useEffect(() => {
        const mutationCache = queryClient.getMutationCache();
        let period: SyncPeriod | undefined;
        let shown: SyncIndicatorState | null = null;
        let timers: number[] = [];

        function update(next: SyncIndicatorState | null) {
            shown = next;
            setState(next);
        }

        function scheduleHide(outcome: SyncOutcome) {
            timers.forEach((timer) => window.clearTimeout(timer));
            timers = [
                window.setTimeout(() => {
                    if (shown) {
                        update({ ...shown, isFading: true });
                    }
                }, VISIBLE_MS[outcome] - FADE_MS),
                window.setTimeout(() => update(null), VISIBLE_MS[outcome]),
            ];
        }

        // While visible, a success changes nothing and a rejection turns the
        // strip red and restarts its time; an error is never hidden early.
        function show(outcome: SyncOutcome, count: number) {
            if (!shown || outcome === "rejected") {
                update({ outcome, count, isFading: false });
                scheduleHide(outcome);
            }
        }

        function trackSyncPeriod() {
            const pending = mutationCache.findAll({
                mutationKey: TRANSACTION_MUTATION_KEY,
                status: "pending",
            });
            if (pending.length > 0) {
                period ??= {
                    changes: new Set(),
                    failuresBefore: new Set(
                        syncFailures.getAll().map((failure) => failure.id),
                    ),
                    wasDisrupted: false,
                };
                for (const mutation of pending) {
                    period.changes.add(mutation.mutationId);
                    if (mutation.state.failureCount > 0) {
                        period.wasDisrupted = true;
                    }
                }
                if (!onlineManager.isOnline()) {
                    period.wasDisrupted = true;
                }
                return;
            }

            const finishedPeriod = period;
            period = undefined;
            if (!finishedPeriod) {
                return;
            }

            // Sync failures are added before their mutation leaves the queue.
            // A rejection always shows, even for a save made while online.
            const failures = syncFailures.getAll();
            const isRejected = failures.some(
                (failure) => !finishedPeriod.failuresBefore.has(failure.id),
            );
            if (isRejected) {
                show("rejected", failures.length);
                reportRejected(failures.length);
            } else if (finishedPeriod.wasDisrupted) {
                show("synced", finishedPeriod.changes.size);
            }
        }

        // Changes restored from the last session are pending from the start.
        trackSyncPeriod();
        const unsubscribeAll = [
            mutationCache.subscribe(trackSyncPeriod),
            onlineManager.subscribe(trackSyncPeriod),
        ];
        return () => {
            unsubscribeAll.forEach((unsubscribe) => unsubscribe());
            timers.forEach((timer) => window.clearTimeout(timer));
        };
    }, [queryClient]);

    return state;
}
