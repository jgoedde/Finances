import { useState } from "react";

export function useDbValidation({
    encryptedDatabase,
    secretKey: keyLocal,
}: {
    encryptedDatabase?: string;
    secretKey?: string;
}) {
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [validationTries, setValidationTries] = useState(0);
    const [isValidDatabase, setIsValidDatabase] = useState(false);

    async function testDatabase() {
        setIsDecrypting(true);
        setValidationTries((prev) => prev + 1);

        try {
            const decrypted = await new Promise<string>((resolve, reject) => {
                const worker = new Worker(
                    new URL("@/workers/decrypt-worker.js", import.meta.url),
                );
                worker.postMessage({
                    ciphertext: encryptedDatabase,
                    key: keyLocal,
                });

                worker.onmessage = (e) => {
                    const { decrypted, error: errorMessage } = e.data;
                    if (errorMessage) reject(new Error(errorMessage));
                    else resolve(decrypted);
                    worker.terminate();
                };
            });
            JSON.parse(decrypted);

            setIsValidDatabase(true);
        } catch (e) {
            if (e instanceof Error) {
                console.error(e);
            }
            setIsValidDatabase(false);
        } finally {
            setIsDecrypting(false);
        }
    }

    return {
        testDatabase,
        validationTries,
        isValidDatabase,
        isDecrypting,
    };
}
