import { useState } from "react";
import { toast } from "sonner";
import {
    type Category,
    FALLBACK_CATEGORIES,
    type TransactionKind,
} from "@finances/shared";
import { apiErrorCode, apiErrorMessage } from "#/api/api-errors.ts";
import { CategoriesView } from "#/features/categories/categories-view.tsx";
import {
    useCategories,
    useCategoryUsage,
    useCreateCategory,
    useDeleteCategory,
    useUpdateCategory,
} from "#/features/categories/category-queries.ts";
import { DeleteCategoryDialog } from "#/features/categories/delete-category-dialog.tsx";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { getCategoryName } from "#/features/transactions/utils/transaction-utils.ts";
import { m } from "#/paraglide/messages.js";

interface UserCategoriesViewProps {
    kind: TransactionKind;
    onKindChange: (kind: TransactionKind) => void;
}

/**
 * The user's own categories. Deleting one moves its transactions to another
 * category of the same kind.
 */
export function UserCategoriesView({
    kind,
    onKindChange,
}: UserCategoriesViewProps) {
    const isOnline = useIsOnline();
    const categories = useCategories();
    const [deleting, setDeleting] = useState<Category | null>(null);
    const usage = useCategoryUsage(deleting?.id ?? null);
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const deleteCategory = useDeleteCategory();

    async function remove(category: Category, moveTo: string | undefined) {
        const name = getCategoryName(category.name);
        try {
            await deleteCategory.mutateAsync({ id: category.id, moveTo });
            toast.success(m.category_deleted({ name }));
        } catch (error) {
            toast.error(
                apiErrorMessage(apiErrorCode(error)) ??
                    m.category_delete_failed({ name }),
            );
        }
    }

    return (
        <>
            <CategoriesView
                title={m.categories_title()}
                kind={kind}
                onKindChange={onKindChange}
                categories={categories}
                onCreate={(input) => createCategory.mutateAsync(input)}
                onUpdate={(id, patch) =>
                    updateCategory.mutateAsync({ id, patch })
                }
                onDelete={setDeleting}
            />
            <DeleteCategoryDialog
                category={
                    deleting && {
                        id: deleting.id,
                        name: getCategoryName(deleting.name),
                    }
                }
                affectedTransactions={usage?.transactions ?? null}
                targets={categories
                    .filter(
                        (category) =>
                            category.kind === deleting?.kind &&
                            category.id !== deleting.id,
                    )
                    .map((category) => ({
                        id: category.id,
                        name: getCategoryName(category.name),
                    }))}
                defaultTargetId={FALLBACK_CATEGORIES[deleting?.kind ?? kind].id}
                isOffline={!isOnline}
                onConfirm={(moveTo) => {
                    if (deleting) {
                        void remove(deleting, moveTo);
                    }
                    setDeleting(null);
                }}
                onClose={() => setDeleting(null)}
            />
        </>
    );
}
