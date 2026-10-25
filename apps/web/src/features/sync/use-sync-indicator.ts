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
 * or requests had to be retried. Normal online saves report nothing.
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

        // While visible, a success changes nothing and a rejection turns a
        // green strip red from now on; an error is never hidden by a success.
        function show(outcome: SyncOutcome, count: number) {
            if (shown?.outcome === "rejected" && outcome === "rejected") {
                update({ ...shown, count });
            } else if (!shown || outcome === "rejected") {
                update({ outcome, count, isFading: false });
                scheduleHide(outcome);
            }
        }

        function check() {
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

            const ended = period;
            period = undefined;
            if (!ended?.wasDisrupted) {
                return;
            }

            // Sync failures are added before their mutation leaves the queue.
            const failures = syncFailures.getAll();
            const isRejected = failures.some(
                (failure) => !ended.failuresBefore.has(failure.id),
            );
            if (isRejected) {
                show("rejected", failures.length);
                reportRejected(failures.length);
            } else {
                show("synced", ended.changes.size);
            }
        }

        // Changes restored from the last session are pending from the start.
        check();
        const unsubscribe = [
            mutationCache.subscribe(check),
            onlineManager.subscribe(check),
        ];
        return () => {
            unsubscribe.forEach((fn) => fn());
            timers.forEach((timer) => window.clearTimeout(timer));
        };
    }, [queryClient]);

    return state;
}
