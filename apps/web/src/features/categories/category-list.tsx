import Plus from "~icons/material-symbols/add-rounded";
import Trash2 from "~icons/material-symbols/delete-outline-rounded";
import type { Category } from "@finances/shared";
import { Button } from "#/components/ui/button.tsx";
import { CategoryAvatar } from "#/features/categories/category-avatar.tsx";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { getCategoryName } from "#/features/transactions/utils/transaction-utils.ts";
import { m } from "#/paraglide/messages.js";

interface CategoryListProps {
    categories: Category[];
    isOnline: boolean;
    onCreate: () => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

/**
 * The categories as a list (compact windows), each deletable except the
 * fallback category, and a button creating a new one.
 */
export function CategoryList({
    categories,
    isOnline,
    onCreate,
    onEdit,
    onDelete,
}: CategoryListProps) {
    return (
        <>
            <ul>
                {categories.map((category) => {
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
                                onClick={() => onEdit(category)}
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
                                        aria-label={m.category_delete_action({
                                            name,
                                        })}
                                        disabled={!isOnline}
                                        onClick={() => onDelete(category)}
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
                    onClick={onCreate}
                >
                    <Plus />
                    {m.category_new()}
                </Button>
            </OfflineHint>
        </>
    );
}
