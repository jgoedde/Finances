import { type Db, encrypt } from "@/lib/encryption-utils.ts";
import type { GitHubClient } from "@/gitHubClient.tsx";
import type { Expense } from "@/components/expense.ts";

export async function encryptAndUpdateGist({
    key,
    gistId,
    gistName,
    expenses,
    apiClient,
}: {
    key: string;
    gistId: string;
    gistName: string;
    expenses: Expense[];
    apiClient: GitHubClient;
}) {
    const encrypted = await encrypt(
        JSON.stringify({
            fixedCosts: [],
            expenses,
            version: 2,
        } as Db),
        key,
    );

    await apiClient.gists.update({
        gist_id: gistId,
        files: {
            [gistName]: {
                content: encrypted,
            },
        },
    });
}
