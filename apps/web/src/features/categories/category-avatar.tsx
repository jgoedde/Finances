import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { cn } from "#/lib/cn.ts";
import { paletteFromHex, toneStyle } from "#/utils/color.ts";

interface CategoryAvatarProps {
    color: string;
    iconName: string;
    className?: string;
}

/**
 * A category's icon on a 40dp circle in its tonal color.
 */
export function CategoryAvatar({
    color,
    iconName,
    className,
}: CategoryAvatarProps) {
    return (
        <div
            aria-hidden
            className={cn(
                `flex size-10 shrink-0 items-center justify-center rounded-full
                bg-(--tone) text-(--on-tone) tone`,
                className,
            )}
            style={toneStyle(paletteFromHex(color))}
        >
            <DynamicIcon name={iconName as IconName} className={"size-6"} />
        </div>
    );
}
