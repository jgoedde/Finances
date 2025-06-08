import type { Expense } from "@/components/expense.ts";
import { decryptLocalStorageData, encrypt } from "@/lib/encryption-utils.ts";
import type { FixedCost } from "@/components/fixed-costs/fixed-cost.ts";

export async function maybeMigrateLocalStorage({ key }: { key: string }) {
    const data = await decryptLocalStorageData(key);

    if (isV1Persistence(data)) {
        console.info(
            "Detected v1 persistence format in localStorage. Migrating to v2 format.",
        );
        console.time("migrateV1Persistence");
        await migrateV1Persistence(data, key);
        console.timeEnd("migrateV1Persistence");
        console.info("Migration to v2 format completed successfully.");
    }
}

export type V1Storage = Expense[];
export type V2Storage = {
    expenses: Expense[];
    fixedCosts: FixedCost[];
    version: 2;
};

export function isV1Persistence(decryptedLocalStorageData: unknown) {
    return Array.isArray(decryptedLocalStorageData);
}

async function migrateV1Persistence(
    decryptedLocalStorageData: Expense[],
    encryptionKey: string,
) {
    const initialV2Data: V2Storage = {
        expenses: decryptedLocalStorageData,
        fixedCosts: [],
        version: 2,
    };

    const encrypted = await encrypt(
        JSON.stringify(initialV2Data),
        encryptionKey,
    );

    localStorage.setItem("expenses", encrypted);
}
