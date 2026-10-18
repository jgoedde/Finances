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
} from "#/components/ui/alert-dialog.tsx";
import { Trash } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import { m } from "#/paraglide/messages.js";

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
                    aria-label={m.action_delete()}
                >
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {m.transaction_delete_title()}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {m.transaction_delete_description()}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{m.action_cancel()}</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                        {m.action_delete()}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
