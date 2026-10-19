import { formatCurrency } from "@finances/shared";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { Transaction } from "@finances/shared";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "#/components/ui/drawer.tsx";
import { Button } from "#/components/ui/button.tsx";
import { checkConnection } from "#/features/sync/connectivity.ts";
import {
    type SyncFailure,
    syncFailures,
} from "#/features/sync/sync-failures.ts";
import {
    type SyncStatus,
    useSyncStatus,
} from "#/features/sync/use-sync-status.ts";
import {
    useDeleteTransaction,
    useSaveTransaction,
} from "#/features/transactions/transaction-mutations.ts";
import type { PendingChange } from "#/features/transactions/pending-changes.ts";
import { apiErrorMessage } from "#/api/api-errors.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

const STATUS_TEXT = {
    failed: m.sync_status_failed,
    offline: m.sync_status_offline,
    pending: m.sync_status_pending,
    synced: m.sync_status_synced,
} as const satisfies Record<SyncStatus["state"], () => string>;

const ACTION_LABEL = {
    save: m.sync_action_saved,
    delete: m.sync_action_deleted,
} as const satisfies Record<PendingChange["action"], () => string>;

function failureReason({ error, reason }: SyncFailure): string {
    if (!error) {
        return reason ?? m.error_unknown();
    }
    return (
        apiErrorMessage(error.code) ??
        m.sync_rejected_status({ status: error.status })
    );
}

function describe(transaction: Transaction): string {
    const sign = transaction.kind === "income" ? "+" : "";
    return `${transaction.counterparty} · ${sign}${formatCurrency(transaction.amount, getLocale())}`;
}

interface SyncDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SyncDrawer({ open, onOpenChange }: SyncDrawerProps) {
    const status = useSyncStatus();
    const saveTransaction = useSaveTransaction();
    const deleteTransaction = useDeleteTransaction();

    const [isChecking, setIsChecking] = useState(false);

    async function syncNow() {
        setIsChecking(true);
        // Paused changes resume as soon as the app is back online.
        const isOnline = await checkConnection();
        setIsChecking(false);
        if (!isOnline) {
            toast.error(m.sync_server_unreachable());
        }
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader className={"text-left"}>
                    <DrawerTitle>{m.sync_title()}</DrawerTitle>
                    <DrawerDescription>
                        {STATUS_TEXT[status.state]()}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
                    {status.failures.length > 0 && (
                        <section className="flex flex-col gap-2">
                            <h3 className="text-title-small text-error">
                                {m.sync_rejected()}
                            </h3>
                            {status.failures.map((failure) => (
                                <div
                                    key={failure.id}
                                    className="flex flex-col gap-2 rounded-md
                                        border border-outline-variant p-3"
                                >
                                    <div className="text-body-large">
                                        {ACTION_LABEL[failure.action]()}:{" "}
                                        {describe(failure.transaction)}
                                    </div>
                                    <div
                                        className="text-body-medium
                                            text-on-surface-variant"
                                    >
                                        {failureReason(failure)}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant={"text"}
                                            onClick={() =>
                                                syncFailures.remove(failure.id)
                                            }
                                        >
                                            {m.action_discard()}
                                        </Button>
                                        <Button
                                            variant={"filledTonal"}
                                            onClick={() => {
                                                syncFailures.remove(failure.id);
                                                const retry =
                                                    failure.action === "save"
                                                        ? saveTransaction
                                                        : deleteTransaction;
                                                retry.mutate(
                                                    failure.transaction,
                                                );
                                            }}
                                        >
                                            {m.action_retry()}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}

                    {status.pending.length > 0 && (
                        <section className="flex flex-col gap-2">
                            <h3 className="text-title-small">
                                {m.sync_pending()}
                            </h3>
                            <ul className="flex flex-col gap-1 text-body-medium">
                                {status.pending.map((change) => (
                                    <li key={change.mutationId}>
                                        {ACTION_LABEL[change.action]()}:{" "}
                                        {describe(change.transaction)}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                variant={"filledTonal"}
                                className={"self-start"}
                                disabled={isChecking}
                                onClick={() => void syncNow()}
                            >
                                <RefreshCw />
                                {m.sync_now()}
                            </Button>
                        </section>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
