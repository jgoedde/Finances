import { useColorScheme } from "@mantine/hooks";
import { convertHexToTonal } from "@/utils/color.ts";
import { Badge } from "@/components/ui/badge.tsx";
import type { Category } from "@/persistence/types.ts";
import { XIcon } from "lucide-react";

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
        <Badge variant={"input"} style={{ backgroundColor, color: textColor }}>
            <span>{category.name}</span>
            <button type={"button"} onClick={() => onClear()}>
                <XIcon className={"size-4"} />
            </button>
        </Badge>
    );
}
