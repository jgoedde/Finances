import { DrawerClose } from "@/components/ui/drawer.tsx";
import { X } from "lucide-react";
import { type Dispatch, type FC, type SetStateAction, useState } from "react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { SelectedCategoriesFilter } from "@/components/search/filters/categories/categories-filter.ts";
import { useCategories } from "@/components/expenses/use-categories.ts";

type Props = {
    selectedCategories: SelectedCategoriesFilter;
    setSelectedCategories: Dispatch<SetStateAction<SelectedCategoriesFilter>>;
    closeDrawer: VoidFunction;
};

export const CategoriesFilterDrawerContent: FC<Props> = ({
    setSelectedCategories,
    selectedCategories,
    closeDrawer,
}) => {
    const categories = useCategories();

    const [localCategories, setLocalCategories] = useState<string[]>(
        selectedCategories.categories,
    );

    return (
        <div className={"mx-4"}>
            <div className={"mb-8 flex gap-x-4"}>
                <DrawerClose asChild>
                    <div>
                        <X />
                    </div>
                </DrawerClose>
                <div className={"font-medium"}>Kategorien</div>
                <button
                    type={"button"}
                    className={"text-primary ml-auto text-sm"}
                    onClick={() => {
                        setSelectedCategories(() => {
                            if (localCategories.length === 0) {
                                return {
                                    isActive: false,
                                    categories: [],
                                };
                            } else {
                                return {
                                    isActive: true,
                                    categories: localCategories,
                                };
                            }
                        });
                        closeDrawer();
                    }}
                >
                    Ok
                </button>
            </div>
            <div
                className={
                    "mb-6 flex max-h-[350px] flex-col gap-y-4 overflow-y-scroll"
                }
            >
                {categories.map((cat) => (
                    <Label
                        htmlFor={cat.color}
                        key={cat.color}
                        className={"flex items-center gap-x-6"}
                    >
                        <div>
                            <DynamicIcon
                                name={cat.icon_name as IconName}
                                className={"text-primary"}
                            />
                        </div>
                        <div>{cat.name}</div>
                        <div className={"mr-4 ml-auto"}>
                            <Checkbox
                                checked={localCategories.includes(cat.color)}
                                onCheckedChange={(e) => {
                                    setLocalCategories((prev) => {
                                        if (e) {
                                            return [...prev, cat.color];
                                        } else {
                                            return prev.filter(
                                                (c) => c !== cat.color,
                                            );
                                        }
                                    });
                                }}
                                id={cat.color}
                            />
                        </div>
                    </Label>
                ))}
            </div>
        </div>
    );
};
