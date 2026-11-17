import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { apiErrorCode, apiErrorMessage } from "#/api/api-errors.ts";
import { CategoryAvatar } from "#/features/categories/category-avatar.tsx";
import {
    CategoryForm,
    type CategoryFormValues,
} from "#/features/categories/category-form.tsx";
import {
    useCategories,
    useCategoryUsage,
    useCreateCategory,
    useDeleteCategory,
    useUpdateCategory,
} from "#/features/categories/category-queries.ts";
import { DeleteCategoryDialog } from "#/features/categories/delete-category-dialog.tsx";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { getCategoryName } from "#/features/transactions/utils/transaction-utils.ts";
import { m } from "#/paraglide/messages.js";

const KIND_TABS = {
    expense: m.categories_tab_expense,
    income: m.categories_tab_income,
} as const satisfies Record<TransactionKind, () => string>;

/**
 * Which category the sheet edits, or `"new"` for a new one.
 */
type Editing = Category | "new" | null;

interface CategoriesViewProps {
    kind: TransactionKind;
    onKindChange: (kind: TransactionKind) => void;
}

/**
 * The user's categories of each kind, to create, edit and delete.
 * Online-only; offline they can only be viewed.
 */
export function CategoriesView({ kind, onKindChange }: CategoriesViewProps) {
    const isOnline = useIsOnline();
    const categories = useCategories();
    const [editing, setEditing] = useState<Editing>(null);
    const [deleting, setDeleting] = useState<Category | null>(null);
    const usage = useCategoryUsage(deleting?.id ?? null);
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const deleteCategory = useDeleteCategory();

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
                await createCategory.mutateAsync({ kind, ...values });
                toast.success(m.category_created({ name: values.name }));
            } else {
                const { color, iconName } = values;
                await updateCategory.mutateAsync({
                    id: editing.id,
                    patch: editing.fallback
                        ? { color, iconName }
                        : { name: values.name, color, iconName },
                });
                toast.success(m.category_updated());
            }
        } catch (error) {
            return handleSaveError(error);
        }
        setEditing(null);
        return undefined;
    }

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

    const fallback = FALLBACK_CATEGORIES[kind];

    return (
        <div className="flex min-h-dvh flex-col">
            <TopAppBar title={m.categories_title()} />
            <Tabs
                value={kind}
                onValueChange={(value) =>
                    onKindChange(value as TransactionKind)
                }
            >
                <TabsList>
                    {(Object.keys(KIND_TABS) as TransactionKind[]).map(
                        (tab) => (
                            <TabsTrigger key={tab} value={tab}>
                                {KIND_TABS[tab]()}
                            </TabsTrigger>
                        ),
                    )}
                </TabsList>
            </Tabs>

            <main className={"mx-auto flex w-full max-w-md flex-col py-2"}>
                {!isOnline && (
                    <p
                        className={`px-4 py-2 text-body-medium
                        text-on-surface-variant`}
                    >
                        {m.categories_offline()}
                    </p>
                )}
                <ul>
                    {ofKind.map((category) => {
                        const name = getCategoryName(category.name);
                        return (
                            <li
                                key={category.id}
                                className={"flex items-center pr-2"}
                            >
                                <button
                                    type={"button"}
                                    className={`state-layer flex min-w-0 grow
                                    cursor-pointer items-center gap-4 py-2 pl-4
                                    text-left focus-ring`}
                                    onClick={() => setEditing(category)}
                                >
                                    <CategoryAvatar
                                        color={category.color}
                                        iconName={category.iconName}
                                    />
                                    <span
                                        className={`truncate text-body-large
                                        text-on-surface`}
                                    >
                                        {name}
                                    </span>
                                </button>
                                {!category.fallback && (
                                    <OfflineHint active={!isOnline}>
                                        <Button
                                            variant={"ghost"}
                                            size={"icon"}
                                            aria-label={m.category_delete_action(
                                                { name },
                                            )}
                                            disabled={!isOnline}
                                            onClick={() =>
                                                setDeleting(category)
                                            }
                                        >
                                            <Trash2 />
                                        </Button>
                                    </OfflineHint>
                                )}
                            </li>
                        );
                    })}
                </ul>
                <OfflineHint active={!isOnline}>
                    <Button
                        variant={"filledTonal"}
                        className={"m-4 self-start"}
                        disabled={!isOnline}
                        onClick={() => setEditing("new")}
                    >
                        <Plus />
                        {m.category_new()}
                    </Button>
                </OfflineHint>
            </main>

            <Drawer
                open={editing !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditing(null);
                    }
                }}
            >
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            {editing === "new"
                                ? m.category_new()
                                : m.category_edit()}
                        </DrawerTitle>
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
                                              name: getCategoryName(
                                                  editing.name,
                                              ),
                                              color: editing.color,
                                              iconName: editing.iconName,
                                          }
                                }
                                isNameLocked={
                                    editing !== "new" && editing.fallback
                                }
                                submitLabel={
                                    editing === "new"
                                        ? m.action_create()
                                        : m.action_save()
                                }
                                isOffline={!isOnline}
                                onSubmit={save}
                                onCancel={() => setEditing(null)}
                            />
                        </div>
                    )}
                </DrawerContent>
            </Drawer>

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
        </div>
    );
}
