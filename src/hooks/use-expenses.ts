import { useGitHubClient } from "@/gitHubClient.tsx";
import { useGitHubConfig } from "@/hooks/useGitHubConfig.ts";
import { useEncryption } from "@/components/use-encryption.ts";
import { useQuery } from "@tanstack/react-query";
import { decryptDatabase } from "@/lib/encryption-utils.ts";

export function useExpensesQueryKey() {
    const [gitHubConfig] = useGitHubConfig();
    const { key: encKey } = useEncryption();

    return ["expenses", gitHubConfig.gistId, encKey];
}

export function useExpenses() {
    const gitHubClient = useGitHubClient();
    const [gitHubConfig] = useGitHubConfig();
    const { key: encKey } = useEncryption();

    const queryKey = useExpensesQueryKey();

    return useQuery({
        queryKey,
        queryFn: async ({ queryKey }) => {
            const gistResponse = await gitHubClient.gists.get({
                gist_id: queryKey[1] as string,
            });

            const file = Object.values(gistResponse.data.files || {})[0]
                ?.filename;

            const encryptedData =
                file == null
                    ? undefined
                    : (gistResponse.data.files ?? {})[file]?.content;

            if (!encryptedData) {
                throw new Error("No encrypted data found in the Gist.");
            }

            const data = await decryptDatabase(
                encryptedData,
                queryKey[2] as string,
            );

            return data.expenses;
        },
        enabled: gitHubConfig.gistId != null && encKey != null,
    });
}
