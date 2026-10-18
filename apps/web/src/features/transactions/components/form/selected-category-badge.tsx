import { useColorScheme } from "@mantine/hooks";
import { convertHexToTonal } from "#/utils/color.ts";
import { Badge } from "#/components/ui/badge.tsx";
import type { Category } from "@finances/shared";
import { XIcon } from "lucide-react";
import { m } from "#/paraglide/messages.js";

interface SelectedCategoryBadgeProps {
    category: Category;
    onClear: VoidFunction;
}

export function SelectedCategoryBadge({
    category,
    onClear,
}: SelectedCategoryBadgeProps) {
    const theme = useColorScheme();

    const tonal = convertHexToTonal(category.color);
    const backgroundColor =
        theme === "dark" ? tonal.dark.container : tonal.light.container;

    const textColor =
        theme === "dark" ? tonal.dark.onContainer : tonal.light.onContainer;

    return (
        <Badge
            asChild
            variant={"input"}
            className={"state-layer cursor-pointer"}
            style={{ backgroundColor, color: textColor }}
        >
            <button
                type={"button"}
                aria-label={m.transaction_remove_category({
                    name: category.name,
                })}
                onClick={() => onClear()}
            >
                {category.name}
                <XIcon aria-hidden />
            </button>
        </Badge>
    );
}
