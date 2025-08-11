import type { Expense } from "@/persistence/types.ts";

export async function encryptAndUpdateGist({
    key,
    gistId,
    gistName,
    expenses,
}: {
    key: string;
    gistId: string;
    gistName: string;
    expenses: Expense[];
}) {
    console.log(
        key,
        gistId,
        gistName,
        expenses,
        "key,gistId,gistName,expenses",
    );
}
