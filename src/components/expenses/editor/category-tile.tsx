import { DynamicIcon } from "lucide-react/dynamic";
import type { Category } from "@/components/expenses/editor/categories.ts";
import { type FC } from "react";
import { convertHexToTonal } from "@/lib/color-utils.ts";
import { useRipple } from "@/hooks/use-ripple.ts";
import { useColorScheme } from "@mantine/hooks";

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
    const theme = useColorScheme();

    const ripple = useRipple();

    const tonal = convertHexToTonal(category.color);
    const backgroundColor =
        theme === "dark" ? tonal.dark.container : tonal.light.container;

    const textColor =
        theme === "dark" ? tonal.dark.onContainer : tonal.light.onContainer;

    return (
        <button
            type={"button"}
            style={{
                ...(selectedCategoryIconNameLocal !== category.icon &&
                    selectedCategoryIconNameLocal !== undefined && {
                        opacity: 0.5,
                    }),
                backgroundColor,
            }}
            className={
                "ripple-container relative flex aspect-square size-1/4 flex-col border-none text-left transition-opacity duration-150"
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
                    "absolute right-1 bottom-1 size-10 transition-colors duration-75"
                }
                style={{
                    color: textColor,
                }}
            >
                <DynamicIcon name={category.icon} className={"size-full"} />
            </div>
        </button>
    );
};
