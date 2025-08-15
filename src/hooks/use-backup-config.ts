import { useLocalStorage, useSessionStorage } from "@mantine/hooks";
import { differenceInHours } from "date-fns";
import { toast, useSonner } from "sonner";
import { PersistentDatabase } from "@/persistence/persistent-database.ts";

export const MIN_BACKUP_INTERVAL_IN_HOURS = 24;
export const MAX_BACKUP_INTERVAL_IN_HOURS = 48;

interface BackupConfig {
    interval: number; // in hours
    lastBackup?: string; // time in ISO format
}

const now = new Date();

export function useBackupCheck() {
    const [backupConfig, setBackupConfig] = useBackupConfig();
    const [dismissed, setDismissed] = useSessionStorage({
        key: "finances-backup",
        defaultValue: false,
        getInitialValueInEffect: false,
    });
    const toasts = useSonner().toasts;

    function showToast() {
        if (toasts.find((t) => t.id === "backup-toast") || dismissed) {
            return;
        }

        toast("Möchtest Du jetzt ein Backup erstellen?", {
            action: {
                onClick: async () => {
                    try {
                        await PersistentDatabase.exportFile();
                    } finally {
                        setBackupConfig((prev) => ({
                            ...prev,
                            lastBackup: now.toISOString(),
                        }));
                        setDismissed(false);
                    }
                },
                label: "Sichern",
            },
            dismissible: true,
            onDismiss: () => {
                console.info(
                    "Dismissed backup toast. Asking again next session.",
                );
                setDismissed(true);
            },
            duration: Infinity,
            id: "backup-toast",
        });
    }

    return () => {
        if (!backupConfig.lastBackup) {
            showToast();
            return;
        }

        if (
            differenceInHours(now, backupConfig.lastBackup) >=
            backupConfig.interval
        ) {
            showToast();
        }
    };
}

export function useBackupConfig() {
    return useLocalStorage<BackupConfig>({
        key: "finances-backup",
        defaultValue: {
            interval: 24,
            lastBackup: undefined,
        },
        getInitialValueInEffect: false,
    });
}
