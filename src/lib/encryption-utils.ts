import { readLocalStorageValue } from "@mantine/hooks";
import {
    isV1Persistence,
    type V1Storage,
    type V2Storage,
} from "@/lib/app-local-storage.ts";

export async function decryptLocalStorageData(
    key: string,
): Promise<V1Storage | V2Storage> {
    const encryptedLs = readLocalStorageValue({
        key: "expenses",
        defaultValue: "",
    });

    if (!encryptedLs) {
        return [];
    }

    const decrypted = await new Promise<string>((resolve) => {
        const worker = new Worker(
            new URL("@/workers/decrypt-worker.js", import.meta.url),
        );
        worker.postMessage({ ciphertext: encryptedLs, key });

        worker.onmessage = (e) => {
            const { decrypted, error: errorMessage } = e.data;
            if (errorMessage) throw new Error(errorMessage);
            else resolve(decrypted);
            worker.terminate();
        };
    });

    const data = JSON.parse(decrypted);

    if (isV1Persistence(decrypted)) {
        return data as V1Storage;
    }

    return data as V2Storage;
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
