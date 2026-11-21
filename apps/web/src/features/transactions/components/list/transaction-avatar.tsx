import type { ComponentProps } from "react";
import type { Category } from "@finances/shared";
import { DynamicIcon } from "lucide-react/dynamic";
import MessageCircleQuestion from "~icons/material-symbols/help-outline-rounded";
import { paletteFromHex, toneStyle } from "#/utils/color.ts";
import { cn } from "#/lib/cn.ts";

interface TransactionAvatarProps {
    category: Category | undefined;
    compact: boolean;
}

/**
 * The category's icon in its tonal color; a question mark without one.
 */
export function TransactionAvatar({
    category,
    compact,
}: TransactionAvatarProps) {
    return (
        <div
            className={cn(
                `flex shrink-0 items-center justify-center rounded-full
                bg-(--tone) text-(--on-tone) tone`,
                compact ? "size-7" : "size-10",
            )}
            style={toneStyle(paletteFromHex(category?.color ?? "#2f2"))}
        >
            {category != null ? (
                <DynamicIcon
                    name={
                        category.iconName as ComponentProps<
                            typeof DynamicIcon
                        >["name"]
                    }
                    className={compact ? "size-4" : "size-6"}
                />
            ) : (
                <MessageCircleQuestion
                    className={compact ? "size-4" : "size-6"}
                />
            )}
        </div>
    );
}
