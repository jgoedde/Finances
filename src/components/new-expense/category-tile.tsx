import { DynamicIcon } from "lucide-react/dynamic";
import type { Category } from "@/components/new-expense/categories.ts";
import { type FC, useMemo } from "react";
import { convertHexToTonal } from "@/lib/color-utils.ts";
import { useTheme } from "@/components/theme-provider.tsx";
import { useRipple } from "@/hooks/use-ripple.ts";

type Props = {
    selectedCategoryIconNameLocal: string | undefined;
    category: Category;
    onClick: () => void;
};

export const CategoryTile: FC<Props> = ({
    category,
    onClick,
    selectedCategoryIconNameLocal,
}) => {
    const { theme } = useTheme();

    const ripple = useRipple();

    const tonal = useMemo(() => {
        return convertHexToTonal(category.color);
    }, [category.color]);

    const backgroundColor = useMemo(() => {
        return theme === "dark" ? tonal.dark.container : tonal.light.container;
    }, [theme, tonal.dark.container, tonal.light.container]);

    const textColor = useMemo(() => {
        return theme === "dark"
            ? tonal.dark.onContainer
            : tonal.light.onContainer;
    }, [theme, tonal.dark.onContainer, tonal.light.onContainer]);

    return (
        <button
            style={{
                ...(selectedCategoryIconNameLocal !== category.icon &&
                    selectedCategoryIconNameLocal !== undefined && {
                        opacity: 0.5,
                    }),
                backgroundColor,
            }}
            className={
                "ripple-container flex aspect-square size-1/4 flex-col border-none text-left transition-opacity duration-150"
            }
            data-ripple-color={"bg-on-surface/20"}
            {...ripple}
            onClick={(e) => {
                ripple.onClick(e);

                onClick();
            }}
        >
            <div
                className={
                    "font-poppins line-clamp-2 px-2 text-xl font-bold break-all"
                }
                style={{
                    color: textColor,
                }}
            >
                {category.name}
            </div>
            <div
                className={
                    "mt-auto self-end justify-self-end p-2 pt-0 transition-colors duration-75"
                }
                style={{
                    color: textColor,
                }}
            >
                <DynamicIcon name={category.icon} className={"size-10"} />
            </div>
        </button>
    );
};
