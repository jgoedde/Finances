import { useState } from "react";
import { toast } from "sonner";
import type {
    CategoryInput,
    CategoryPatch,
    Category,
    TransactionKind,
} from "@finances/shared";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { apiErrorCode, apiErrorMessage } from "#/api/api-errors.ts";
import type { CategoryFormValues } from "#/features/categories/category-form.tsx";
import { CategoryGrid } from "#/features/categories/category-grid.tsx";
import { CategoryKindTabs } from "#/features/categories/category-kind-tabs.tsx";
import { CategoryList } from "#/features/categories/category-list.tsx";
import {
    CategorySheet,
    type Editing,
} from "#/features/categories/category-sheet.tsx";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { useIsMediumWindow } from "#/hooks/use-is-medium-window.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

interface CategoriesViewProps {
    title: string;

    /**
     * Shown above the categories, e.g. who changes affect.
     */
    hint?: string;
    kind: TransactionKind;
    onKindChange: (kind: TransactionKind) => void;

    /**
     * Of both kinds; the view shows those of `kind`.
     */
    categories: Category[];

    /**
     * Saving rejects with the API's error, which the view shows.
     */
    onCreate: (input: CategoryInput) => Promise<unknown>;
    onUpdate: (id: string, patch: CategoryPatch) => Promise<unknown>;

    /**
     * Starts deleting `category` (not a fallback category), usually by
     * asking to confirm.
     */
    onDelete: (category: Category) => void;
}

/**
 * Categories of each kind, to create, edit and delete. Knows nothing about
 * whose categories they are, so the user's categories and the admin's
 * default categories share it. Online-only; offline they can only be viewed.
 */
export function CategoriesView({
    title,
    hint,
    kind,
    onKindChange,
    categories,
    onCreate,
    onUpdate,
    onDelete,
}: CategoriesViewProps) {
    const isOnline = useIsOnline();
    const isMediumWindow = useIsMediumWindow();
    const [editing, setEditing] = useState<Editing>(null);

    const ofKind = categories.filter((category) => category.kind === kind);

    /**
     * The message for the name field if `error` is about the name;
     * otherwise shows a toast.
     */
    function handleSaveError(error: unknown): string | undefined {
        const code = apiErrorCode(error);
        if (code === "category_name_taken") {
            return apiErrorMessage(code);
        }
        toast.error(apiErrorMessage(code) ?? m.category_save_failed());
        return undefined;
    }

    async function save(values: CategoryFormValues) {
        if (editing === null) {
            return undefined;
        }
        try {
            if (editing === "new") {
                await onCreate({ kind, ...values });
                toast.success(m.category_created({ name: values.name }));
            } else {
                const { color, iconName } = values;
                await onUpdate(
                    editing.id,
                    editing.fallback
                        ? { color, iconName }
                        : { name: values.name, color, iconName },
                );
                toast.success(m.category_updated());
            }
        } catch (error) {
            return handleSaveError(error);
        }
        setEditing(null);
        return undefined;
    }

    return (
        <div className="flex min-h-dvh flex-col">
            <TopAppBar title={title} />
            <CategoryKindTabs
                kind={kind}
                onKindChange={onKindChange}
                isMediumWindow={isMediumWindow}
            />

            <main
                className={cn(
                    "flex w-full flex-col",
                    isMediumWindow ? "gap-2 p-6" : "mx-auto max-w-md py-2",
                )}
            >
                {hint !== undefined && (
                    <p
                        className={cn(
                            "py-2 text-body-medium text-on-surface-variant",
                            !isMediumWindow && "px-4",
                        )}
                    >
                        {hint}
                    </p>
                )}
                {!isOnline && (
                    <p
                        className={`px-4 py-2 text-body-medium
                        text-on-surface-variant`}
                    >
                        {m.categories_offline()}
                    </p>
                )}
                {isMediumWindow ? (
                    <CategoryGrid
                        categories={ofKind}
                        isOnline={isOnline}
                        onCreate={() => setEditing("new")}
                        onEdit={setEditing}
                    />
                ) : (
                    <CategoryList
                        categories={ofKind}
                        isOnline={isOnline}
                        onCreate={() => setEditing("new")}
                        onEdit={setEditing}
                        onDelete={onDelete}
                    />
                )}
            </main>

            <CategorySheet
                editing={editing}
                kind={kind}
                isOnline={isOnline}
                isMediumWindow={isMediumWindow}
                onClose={() => setEditing(null)}
                onDelete={onDelete}
                onSubmit={save}
            />
        </div>
    );
}
