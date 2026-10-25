import { useState } from "react";
import { toast } from "sonner";
import { SyncDrawer } from "#/features/sync/sync-drawer.tsx";
import {
    type SyncIndicatorState,
    useSyncIndicator,
} from "#/features/sync/use-sync-indicator.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

const REJECTED_TOAST_ID = "sync-rejected";

const OUTCOME_CLASS = {
    synced: "bg-income",
    rejected: "bg-error",
} as const satisfies Record<SyncIndicatorState["outcome"], string>;

const OUTCOME_TEXT = {
    synced: m.sync_indicator_synced,
    rejected: m.sync_indicator_rejected,
} as const satisfies Record<
    SyncIndicatorState["outcome"],
    (inputs: { count: number }) => string
>;

/**
 * A thin strip at the top edge once pending changes have been synced after
 * the app was offline: green when all went through, red with a toast when
 * the server rejected changes. Screen readers hear the result instead.
 */
export function SyncIndicator() {
    // Its own drawer, opened from the toast; the account menu has another.
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const state = useSyncIndicator({
        onRejected: (count) => {
            // One toast, updated by every further rejection.
            toast.error(m.sync_indicator_rejected({ count }), {
                id: REJECTED_TOAST_ID,
                action: {
                    label: m.action_details(),
                    onClick: () => setIsDrawerOpen(true),
                },
            });
        },
    });

    return (
        <>
            {state && (
                <div
                    aria-hidden
                    data-testid={"sync-indicator"}
                    data-state={state.outcome}
                    className={cn(
                        `fixed inset-x-0 top-0 z-60 h-1 origin-left
                        animate-sync-strip-grow shadow-elevation-2
                        transition-[background-color,opacity] duration-500
                        ease-standard`,
                        OUTCOME_CLASS[state.outcome],
                        state.isFading && "opacity-0",
                    )}
                />
            )}
            <div role={"status"} aria-live={"polite"} className={"sr-only"}>
                {state && OUTCOME_TEXT[state.outcome]({ count: state.count })}
            </div>
            <SyncDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
        </>
    );
}
