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
import { type FC, useCallback } from "react";
import { removeExpense } from "@/components/expenses/slice.ts";
import { saveToLocalStorage } from "@/components/expenses/actions.ts";
import { useAppDispatch } from "@/hooks.ts";
import { useEncryption } from "@/components/use-encryption.ts";

type Props = {
    expenseId: string;
};

export const DeleteButtonWithConfirmDialog: FC<Props> = ({ expenseId }) => {
    const dispatch = useAppDispatch();

    const { key } = useEncryption();

    const onDeleteConfirmButtonClick = useCallback(() => {
        if (!key || !expenseId) {
            return;
        }

        dispatch(removeExpense(expenseId));
        void dispatch(
            saveToLocalStorage({
                encryptionKey: key,
            }),
        );
    }, [key, dispatch, expenseId]);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className={"cursor-pointer"}>
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
