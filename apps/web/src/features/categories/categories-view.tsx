import { useState } from "react";
import Plus from "~icons/material-symbols/add-rounded";
import Trash2 from "~icons/material-symbols/delete-outline-rounded";
import { toast } from "sonner";
import {
    type Category,
    type CategoryInput,
    type CategoryPatch,
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
import { CategoryGrid } from "#/features/categories/category-grid.tsx";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { getCategoryName } from "#/features/transactions/utils/transaction-utils.ts";
import { useIsMediumWindow } from "#/hooks/use-is-medium-window.ts";
import { cn } from "#/lib/cn.ts";
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

    const fallback = FALLBACK_CATEGORIES[kind];

    return (
        <div className="flex min-h-dvh flex-col">
            <TopAppBar title={title} />
            <Tabs
                value={kind}
                onValueChange={(value) =>
                    onKindChange(value as TransactionKind)
                }
            >
                <TabsList
                    className={cn(
                        isMediumWindow && "px-6 *:max-w-60 *:flex-none",
                    )}
                >
                    {(Object.keys(KIND_TABS) as TransactionKind[]).map(
                        (tab) => (
                            <TabsTrigger key={tab} value={tab}>
                                {KIND_TABS[tab]()}
                            </TabsTrigger>
                        ),
                    )}
                </TabsList>
            </Tabs>

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
                    <>
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
                                            className={`state-layer flex min-w-0
                                                grow cursor-pointer items-center
                                                gap-4 py-2 pl-4 text-left
                                                focus-ring`}
                                            onClick={() => setEditing(category)}
                                        >
                                            <CategoryAvatar
                                                color={category.color}
                                                iconName={category.iconName}
                                            />
                                            <span
                                                className={`truncate
                                                    text-body-large
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
                                                        onDelete(category)
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
                    </>
                )}
            </main>

            <Drawer
                direction={isMediumWindow ? "right" : "bottom"}
                open={editing !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditing(null);
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
                                            setEditing(null);
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
        </div>
    );
}
