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

interface DeleteButtonWithConfirmDialogProps {
    title: string;
    description: string;
    disabled?: boolean;
    onDelete: VoidFunction;
}

/**
 * Delete icon button for a top app bar that asks for confirmation first.
 */
export function DeleteButtonWithConfirmDialog({
    title,
    description,
    disabled,
    onDelete,
}: DeleteButtonWithConfirmDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    type={"button"}
                    variant={"ghost"}
                    size={"icon"}
                    aria-label={m.action_delete()}
                    disabled={disabled}
                >
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
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
