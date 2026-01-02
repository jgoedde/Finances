import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import { Trash } from "lucide-react";
import { type FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import { expensesRepository } from "@/persistence/repository.ts";

type Props = {
    expenseId: string;
};

export const DeleteButtonWithConfirmDialog: FC<Props> = ({ expenseId }) => {
    const navigate = useNavigate();

    function onDeleteConfirmButtonClick() {
        void expensesRepository.delete(expenseId);
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
                    <AlertDialogTitle>Bist du sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden. Die
                        Feldbewegung wird aus der Historie gelöscht.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className={"text-primary"}>
                        Abbrechen
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDeleteConfirmButtonClick}
                        className={"text-primary"}
                    >
                        Ja
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
