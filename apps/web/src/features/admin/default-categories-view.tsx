import { useMemo } from "react";
import { toast } from "sonner";
import type { Category, TransactionKind } from "@finances/shared";
import { confirmAction } from "#/components/confirm-dialog.tsx";
import { apiErrorCode, apiErrorMessage } from "#/api/api-errors.ts";
import {
    useCreateDefaultCategory,
    useDefaultCategories,
    useDeleteDefaultCategory,
    useUpdateDefaultCategory,
} from "#/features/admin/default-category-queries.ts";
import { CategoriesView } from "#/features/categories/categories-view.tsx";
import { getCategoryName } from "#/features/transactions/utils/transaction-utils.ts";
import { m } from "#/paraglide/messages.js";

interface DefaultCategoriesViewProps {
    kind: TransactionKind;
    onKindChange: (kind: TransactionKind) => void;
}

/**
 * The instance's default categories, which new users get a copy of. No
 * transaction references them, so deleting one moves nothing.
 */
export function DefaultCategoriesView({
    kind,
    onKindChange,
}: DefaultCategoriesViewProps) {
    const defaults = useDefaultCategories();
    const createDefault = useCreateDefaultCategory();
    const updateDefault = useUpdateDefaultCategory();
    const deleteDefault = useDeleteDefaultCategory();

    const categories = useMemo(
        () =>
            defaults.map((category): Category => ({
                ...category,
                fallback: false,
            })),
        [defaults],
    );

    async function remove(category: Category) {
        const name = getCategoryName(category.name);
        if (
            !(await confirmAction({
                title: m.category_delete_title({ name }),
                description: m.admin_default_category_delete_description(),
                confirmLabel: m.action_delete(),
                destructive: true,
            }))
        ) {
            return;
        }
        try {
            await deleteDefault.mutateAsync(category.id);
            toast.success(m.category_deleted({ name }));
        } catch (error) {
            toast.error(
                apiErrorMessage(apiErrorCode(error)) ??
                    m.category_delete_failed({ name }),
            );
        }
    }

    return (
        <CategoriesView
            title={m.admin_default_categories_title()}
            hint={m.admin_default_categories_hint()}
            kind={kind}
            onKindChange={onKindChange}
            categories={categories}
            onCreate={(input) => createDefault.mutateAsync(input)}
            onUpdate={(id, patch) => updateDefault.mutateAsync({ id, patch })}
            onDelete={(category) => void remove(category)}
        />
    );
}
