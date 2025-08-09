import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { Trash } from "lucide-react";
import { type FC } from "react";
import { useEncryption } from "@/components/use-encryption.ts";
import { useGitHubClient } from "@/gitHubClient.tsx";
import { useGitHubConfig } from "@/hooks/useGitHubConfig.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useExpenses, useExpensesQueryKey } from "@/hooks/use-expenses.ts";
import { encryptAndUpdateGist } from "@/components/expenses/actions.ts";
import { useNavigate } from "@tanstack/react-router";
import type { Expense } from "@/components/expense.ts";

type Props = {
    expenseId: string;
};

export const DeleteButtonWithConfirmDialog: FC<Props> = ({ expenseId }) => {
    const [gitHubConfig] = useGitHubConfig();
    const { key } = useEncryption();
    const navigate = useNavigate();
    const gitHubClient = useGitHubClient();
    const queryClient = useQueryClient();
    const expenses = useExpenses().data ?? [];
    const expensesQueryKey = useExpensesQueryKey();

    const mutation = useMutation({
        mutationFn: () => {
            if (!key || !gitHubConfig.gistId || !expensesQueryKey) {
                return Promise.resolve();
            }

            return encryptAndUpdateGist({
                key,
                gistId: gitHubConfig.gistId,
                gistName: gitHubConfig.gistName,
                expenses: expenses.filter(
                    (expense) => expense.id !== expenseId,
                ),
                apiClient: gitHubClient,
            });
        },
        onMutate: async () => {
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: expensesQueryKey });

            // Optimistically update to the new value
            queryClient.setQueryData(expensesQueryKey, (old: Expense[]) => [
                ...(old ?? []).filter((expense) => expense.id !== expenseId),
            ]);
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: expensesQueryKey });
        },
    });

    function onDeleteConfirmButtonClick() {
        mutation.mutate();

        void navigate({ to: "/" });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button type={"button"} className={"cursor-pointer"}>
                    <Trash className={"size-5"} />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will remove this
                        expense from your history.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className={"text-primary"}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDeleteConfirmButtonClick}
                        className={"text-primary"}
                    >
                        Yes
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
