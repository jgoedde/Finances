import type { Expense } from "@/components/expense.ts";
import type { FixedCost } from "@/components/fixed-costs/fixed-cost.ts";

export interface Db {
    expenses: Expense[];
    fixedCosts: FixedCost[];
    version: 2;
}

export async function decryptDatabase(
    encryptedData: string,
    key: string,
): Promise<Db> {
    const decrypted = await new Promise<string>((resolve) => {
        const worker = new Worker(
            new URL("@/workers/decrypt-worker.js", import.meta.url),
        );
        worker.postMessage({ ciphertext: encryptedData, key });

        worker.onmessage = (e) => {
            const { decrypted, error: errorMessage } = e.data;
            if (errorMessage) throw new Error(errorMessage);
            else resolve(decrypted);
            worker.terminate();
        };
    });

    return JSON.parse(decrypted) as Db;
}

export async function encrypt(data: unknown, encryptionKey: string) {
    return await new Promise<string>((resolve) => {
        const worker = new Worker(
            new URL("@/workers/encrypt-worker.js", import.meta.url),
        );
        worker.postMessage({
            plaintext: data,
            key: encryptionKey,
        });

        worker.onmessage = (e) => {
            const { encrypted, error: errorMessage } = e.data;
            if (errorMessage) throw new Error(errorMessage);
            else resolve(encrypted);
            worker.terminate();
        };
    });
}
