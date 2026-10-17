import { useMutationState } from "@tanstack/react-query";
import type { Transaction } from "@finances/shared";
import { useIsOnline } from "@/features/sync/connectivity.ts";
import {
    type SyncFailure,
    useSyncFailures,
} from "@/features/sync/sync-failures.ts";
import {
    type PendingChange,
    TRANSACTION_MUTATION_KEY,
} from "@/features/transactions/pending-changes.ts";

export type SyncState = "failed" | "offline" | "pending" | "synced";

export interface SyncStatus {
    /** The most urgent state, for the indicator. */
    state: SyncState;
    isOnline: boolean;
    pending: QueuedChange[];
    failures: SyncFailure[];
}

export interface QueuedChange extends PendingChange {
    /** Unique per queued mutation; one transaction can be queued twice. */
    mutationId: number;
}

export function usePendingChanges(): QueuedChange[] {
    return useMutationState({
        filters: { mutationKey: TRANSACTION_MUTATION_KEY, status: "pending" },
        select: (mutation) => ({
            action: mutation.options
                .mutationKey?.[1] as PendingChange["action"],
            transaction: mutation.state.variables as Transaction,
            mutationId: mutation.mutationId,
        }),
    });
}

export function useSyncStatus(): SyncStatus {
    const isOnline = useIsOnline();
    const pending = usePendingChanges();
    const failures = useSyncFailures();

    const state: SyncState =
        failures.length > 0
            ? "failed"
            : !isOnline
              ? "offline"
              : pending.length > 0
                ? "pending"
                : "synced";

    return { state, isOnline, pending, failures };
}
