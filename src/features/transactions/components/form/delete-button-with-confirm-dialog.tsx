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

type Props = {
    onDelete: VoidFunction;
};

export function DeleteButtonWithConfirmDialog({ onDelete }: Props) {
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
                        Buchung wird aus der Historie gelöscht.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className={"text-primary"}>
                        Abbrechen
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDelete}
                        className={"text-primary"}
                    >
                        Ja
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
