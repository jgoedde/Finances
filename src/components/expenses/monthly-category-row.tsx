import type { Category } from "@/components/expenses/editor/categories.ts";
import { DynamicIcon } from "lucide-react/dynamic";
import { useAppSelector } from "@/redux-hooks.ts";
import { formatEuro } from "@/lib/currency-utils.ts";
import {
    selectSpentThisMonth,
    selectSpentThisMonthInCategory,
} from "@/components/expenses/selectors.ts";
import { cn } from "@/lib/utils.ts";

export function MonthlyCategoryRow({ category }: { category: Category }) {
    const spentAmount = useAppSelector((state) =>
        selectSpentThisMonthInCategory(state, category.name),
    );
    const spentThisMonth = useAppSelector(selectSpentThisMonth);

    const percentageOfTotal = spentAmount / spentThisMonth;

    if (spentAmount === 0) {
        return null;
    }

    let blocksAmount = 0;

    if (percentageOfTotal >= 0.2) {
        blocksAmount = 5;
    } else if (percentageOfTotal >= 0.1) {
        blocksAmount = 4;
    } else if (percentageOfTotal >= 0.05) {
        blocksAmount = 3;
    } else if (percentageOfTotal >= 0.02) {
        blocksAmount = 2;
    } else {
        blocksAmount = 1;
    }

    const blocks = Array.from({ length: blocksAmount }, (_, i) => (
        <div
            key={i}
            className={cn(
                `bg-primary size-4`,
                i === 0 && "rounded-l-xs",
                i === blocksAmount - 1 && "rounded-r-xs",
            )}
        />
    ));

    return (
        <div className={"flex items-center justify-between gap-x-2"}>
            <div className={"flex items-center gap-x-3"}>
                <div>
                    <DynamicIcon
                        name={category.icon}
                        className="text-outline text-lg"
                    />
                </div>
                <div className={"font-medium"}>{category.name}</div>
            </div>
            <div className={"flex items-center gap-x-3"}>
                <div className={"motion-preset-slide-right flex"}>{blocks}</div>
                <div
                    className={
                        "text-on-surface-variant w-16 text-right text-sm"
                    }
                >
                    <div className={"w-full truncate"}>
                        {formatEuro(spentAmount)}
                    </div>
                </div>
            </div>
        </div>
    );
}
