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
import { Button } from "@/components/ui/button.tsx";

type Props = {
    onDelete: VoidFunction;
};

export function DeleteButtonWithConfirmDialog({ onDelete }: Props) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    type={"button"}
                    variant={"ghost"}
                    size={"icon"}
                    aria-label={"Löschen"}
                >
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Buchung löschen?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden. Die
                        Buchung wird aus der Historie gelöscht.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                        Löschen
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
