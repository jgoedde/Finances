import { useLocalStorage } from "@mantine/hooks";
import { differenceInHours } from "date-fns";

export const MIN_BACKUP_INTERVAL_IN_HOURS = 24;
export const MAX_BACKUP_INTERVAL_IN_HOURS = 48;

interface BackupConfig {
    interval: number; // in hours
    lastBackup?: string; // time in ISO format
}

export function isBackupOverdue(date: Date, backupConfig: BackupConfig) {
    if (backupConfig.interval === -1) {
        return false;
    }

    if (!backupConfig.lastBackup) {
        return true;
    }

    return (
        differenceInHours(date, backupConfig.lastBackup) >=
        backupConfig.interval
    );
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
