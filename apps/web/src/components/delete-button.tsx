import { Trash } from "lucide-react";
import { confirmAction } from "#/components/confirm-dialog.tsx";
import { Button } from "#/components/ui/button.tsx";
import { m } from "#/paraglide/messages.js";

interface DeleteButtonProps {
    /**
     * Title of the confirm dialog.
     */
    title: string;

    /**
     * Description of the confirm dialog.
     */
    description: string;
    disabled?: boolean;
    onDelete: VoidFunction;
}

/**
 * Delete icon button for a top app bar that asks for confirmation first.
 */
export function DeleteButton({
    title,
    description,
    disabled,
    onDelete,
}: DeleteButtonProps) {
    async function confirmDelete() {
        if (
            await confirmAction({
                title,
                description,
                confirmLabel: m.action_delete(),
                destructive: true,
            })
        ) {
            onDelete();
        }
    }

    return (
        <Button
            type={"button"}
            variant={"ghost"}
            size={"icon"}
            aria-label={m.action_delete()}
            disabled={disabled}
            onClick={() => void confirmDelete()}
        >
            <Trash />
        </Button>
    );
}
