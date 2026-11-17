import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "#/components/ui/alert-dialog.tsx";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx";
import { m } from "#/paraglide/messages.js";

interface DeleteTarget {
    id: string;
    name: string;
}

interface DeleteCategoryDialogProps {
    /**
     * The category to delete; the dialog is open while set.
     */
    category: DeleteTarget | null;

    /**
     * How many transactions would move; `null` while loading.
     */
    affectedTransactions: number | null;

    /**
     * Where they can move: the categories of the same kind besides
     * `category`.
     */
    targets: DeleteTarget[];

    /**
     * Preselected target, usually the fallback category.
     */
    defaultTargetId: string;
    isOffline: boolean;

    /**
     * `moveTo` is only set when transactions are affected.
     */
    onConfirm: (moveTo: string | undefined) => void;
    onClose: () => void;
}

/**
 * Asks to confirm deleting a category and, if it has transactions, where
 * to move them.
 */
export function DeleteCategoryDialog({
    category,
    affectedTransactions,
    targets,
    defaultTargetId,
    isOffline,
    onConfirm,
    onClose,
}: DeleteCategoryDialogProps) {
    const [targetId, setTargetId] = useState(defaultTargetId);
    // Back to the default whenever another category is up for deletion.
    const [shownId, setShownId] = useState(category?.id);
    if (category?.id !== shownId) {
        setShownId(category?.id);
        setTargetId(defaultTargetId);
    }

    const isUsed = affectedTransactions !== null && affectedTransactions > 0;

    return (
        <AlertDialog
            open={category !== null}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <AlertDialogContent onOverlayClick={onClose}>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {m.category_delete_title({
                            name: category?.name ?? "",
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {affectedTransactions === null
                            ? m.category_delete_counting()
                            : isUsed
                              ? m.category_delete_used({
                                    count: affectedTransactions,
                                })
                              : m.category_delete_unused()}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {isUsed && (
                    <Field>
                        <FieldLabel>{m.category_delete_target()}</FieldLabel>
                        <Select value={targetId} onValueChange={setTargetId}>
                            <SelectTrigger className={"w-full"}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {targets.map((target) => (
                                    <SelectItem
                                        key={target.id}
                                        value={target.id}
                                    >
                                        {target.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel>{m.action_cancel()}</AlertDialogCancel>
                    <AlertDialogAction
                        className={"text-error"}
                        disabled={isOffline || affectedTransactions === null}
                        onClick={() => onConfirm(isUsed ? targetId : undefined)}
                    >
                        {m.action_delete()}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
