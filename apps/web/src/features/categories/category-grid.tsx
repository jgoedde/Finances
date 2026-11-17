import { Lock, Plus } from "lucide-react";
import type { Category } from "@finances/shared";
import { CategoryAvatar } from "#/features/categories/category-avatar.tsx";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { getCategoryName } from "#/features/transactions/utils/transaction-utils.ts";
import { m } from "#/paraglide/messages.js";
import { paletteFromHex, toneStyle } from "#/utils/color.ts";

interface CategoryGridProps {
    categories: Category[];
    isOnline: boolean;
    onCreate: () => void;
    onEdit: (category: Category) => void;
}

/**
 * The categories as tiles filling the width (medium windows and wider), the
 * first tile creating a new one. A lock marks the fallback category.
 */
export function CategoryGrid({
    categories,
    isOnline,
    onCreate,
    onEdit,
}: CategoryGridProps) {
    return (
        <div
            className={`grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]
                gap-4`}
        >
            <OfflineHint active={!isOnline}>
                <button
                    type={"button"}
                    disabled={!isOnline}
                    onClick={onCreate}
                    className={`state-layer flex aspect-square w-full
                        cursor-pointer flex-col items-center justify-center
                        gap-3 rounded-lg border border-dashed border-outline
                        text-title-medium text-primary focus-ring
                        disabled:cursor-not-allowed disabled:opacity-38`}
                >
                    <Plus aria-hidden className={"size-8"} />
                    {m.category_new()}
                </button>
            </OfflineHint>
            {categories.map((category) => (
                <button
                    key={category.id}
                    type={"button"}
                    onClick={() => onEdit(category)}
                    className={`state-layer relative flex aspect-square
                    cursor-pointer flex-col items-center justify-center gap-3
                    overflow-hidden rounded-lg bg-surface-container-low p-4
                    text-center text-on-surface shadow-elevation-1 focus-ring`}
                >
                    <span
                        aria-hidden
                        className={
                            "absolute inset-x-0 top-0 h-1.5 bg-(--tone) tone"
                        }
                        style={toneStyle(paletteFromHex(category.color))}
                    />
                    <CategoryAvatar
                        color={category.color}
                        iconName={category.iconName}
                        className={"size-16 [&_svg]:size-8"}
                    />
                    <span className={"line-clamp-2 text-title-medium"}>
                        {getCategoryName(category.name)}
                    </span>
                    {category.fallback && (
                        <Lock
                            aria-hidden
                            className={`absolute top-3 right-3 size-4
                            text-on-surface-variant`}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}
