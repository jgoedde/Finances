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
import { formatEuro } from "#/utils/currency.ts";
import { checkConnection } from "#/features/sync/connectivity.ts";
import { syncFailures } from "#/features/sync/sync-failures.ts";
import {
    type SyncStatus,
    useSyncStatus,
} from "#/features/sync/use-sync-status.ts";
import {
    useDeleteTransaction,
    useSaveTransaction,
} from "#/features/transactions/transaction-mutations.ts";
import type { PendingChange } from "#/features/transactions/pending-changes.ts";

const STATUS_TEXT = {
    failed: "Einige Änderungen wurden abgelehnt.",
    offline: "Offline – Änderungen werden später übertragen.",
    pending: "Wird synchronisiert …",
    synced: "Alles synchronisiert.",
} as const satisfies Record<SyncStatus["state"], string>;

const ACTION_LABEL = {
    save: "Gespeichert",
    delete: "Gelöscht",
} as const satisfies Record<PendingChange["action"], string>;

function describe(transaction: Transaction): string {
    const sign = transaction.kind === "income" ? "+" : "";
    return `${transaction.name} · ${sign}${formatEuro(transaction.amount)}`;
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
            toast.error("Der Server ist gerade nicht erreichbar.");
        }
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader className={"text-left"}>
                    <DrawerTitle>Synchronisierung</DrawerTitle>
                    <DrawerDescription>
                        {STATUS_TEXT[status.state]}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
                    {status.failures.length > 0 && (
                        <section className="flex flex-col gap-2">
                            <h3 className="text-title-small text-error">
                                Abgelehnt
                            </h3>
                            {status.failures.map((failure) => (
                                <div
                                    key={failure.id}
                                    className="flex flex-col gap-2 rounded-md
                                        border border-outline-variant p-3"
                                >
                                    <div className="text-body-large">
                                        {ACTION_LABEL[failure.action]}:{" "}
                                        {describe(failure.transaction)}
                                    </div>
                                    <div
                                        className="text-body-medium
                                            text-on-surface-variant"
                                    >
                                        {failure.reason}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant={"text"}
                                            onClick={() =>
                                                syncFailures.remove(failure.id)
                                            }
                                        >
                                            Verwerfen
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
                                            Erneut versuchen
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}

                    {status.pending.length > 0 && (
                        <section className="flex flex-col gap-2">
                            <h3 className="text-title-small">Ausstehend</h3>
                            <ul className="flex flex-col gap-1 text-body-medium">
                                {status.pending.map((change) => (
                                    <li key={change.mutationId}>
                                        {ACTION_LABEL[change.action]}:{" "}
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
                                Jetzt synchronisieren
                            </Button>
                        </section>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
