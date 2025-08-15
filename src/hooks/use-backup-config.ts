import { useLocalStorage } from "@mantine/hooks";

export const MIN_BACKUP_INTERVAL_IN_HOURS = 24;
export const MAX_BACKUP_INTERVAL_IN_HOURS = 48;

export function useBackupConfig() {
    return useLocalStorage({
        key: "finances-backup",
        defaultValue: {
            interval: 24, // in hours
            lastBackup: undefined, // timestamp of the last backup
        },
        getInitialValueInEffect: false,
    });
}
