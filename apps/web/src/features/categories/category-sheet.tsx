import Trash2 from "~icons/material-symbols/delete-outline-rounded";
import {
    type Category,
    FALLBACK_CATEGORIES,
    type TransactionKind,
} from "@finances/shared";
import { Button } from "#/components/ui/button.tsx";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "#/components/ui/drawer.tsx";
import {
    CategoryForm,
    type CategoryFormValues,
} from "#/features/categories/category-form.tsx";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { getCategoryName } from "#/features/transactions/utils/transaction-utils.ts";
import { m } from "#/paraglide/messages.js";

/**
 * Which category the sheet edits, or `"new"` for a new one.
 */
export type Editing = Category | "new" | null;

interface CategorySheetProps {
    editing: Editing;

    /**
     * The kind of a new category, which starts with its fallback's look.
     */
    kind: TransactionKind;
    isOnline: boolean;

    /**
     * Medium windows open the sheet on the right and delete from it.
     */
    isMediumWindow: boolean;
    onClose: VoidFunction;
    onDelete: (category: Category) => void;

    /**
     * Resolves to the message for the name field, if saving failed because
     * of the name.
     */
    onSubmit: (values: CategoryFormValues) => Promise<string | undefined>;
}

/**
 * Sheet that creates or edits a category.
 */
export function CategorySheet({
    editing,
    kind,
    isOnline,
    isMediumWindow,
    onClose,
    onDelete,
    onSubmit,
}: CategorySheetProps) {
    const fallback = FALLBACK_CATEGORIES[kind];

    return (
        <Drawer
            direction={isMediumWindow ? "right" : "bottom"}
            open={editing !== null}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DrawerContent className={"sm:max-w-md"}>
                <DrawerHeader className={"flex-row items-center"}>
                    <DrawerTitle className={"grow"}>
                        {editing === "new"
                            ? m.category_new()
                            : m.category_edit()}
                    </DrawerTitle>
                    {/* Compact windows delete from the list. */}
                    {isMediumWindow &&
                        editing !== null &&
                        editing !== "new" &&
                        !editing.fallback && (
                            <OfflineHint active={!isOnline}>
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    aria-label={m.category_delete_action({
                                        name: getCategoryName(editing.name),
                                    })}
                                    disabled={!isOnline}
                                    onClick={() => {
                                        onClose();
                                        onDelete(editing);
                                    }}
                                >
                                    <Trash2 />
                                </Button>
                            </OfflineHint>
                        )}
                </DrawerHeader>
                {editing !== null && (
                    <div className={"overflow-y-auto px-4 pb-6"}>
                        <CategoryForm
                            key={editing === "new" ? "new" : editing.id}
                            initialValues={
                                editing === "new"
                                    ? {
                                          name: "",
                                          color: fallback.color,
                                          iconName: fallback.iconName,
                                      }
                                    : {
                                          name: getCategoryName(editing.name),
                                          color: editing.color,
                                          iconName: editing.iconName,
                                      }
                            }
                            isNameLocked={editing !== "new" && editing.fallback}
                            submitLabel={
                                editing === "new"
                                    ? m.action_create()
                                    : m.action_save()
                            }
                            isOffline={!isOnline}
                            onSubmit={onSubmit}
                            onCancel={onClose}
                        />
                    </div>
                )}
            </DrawerContent>
        </Drawer>
    );
}
