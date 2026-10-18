import { Badge } from "#/components/ui/badge.tsx";
import { CategoryLink } from "#/features/transactions/components/list/category-link.tsx";
import { useMonthCategoryTotals } from "#/features/transactions/components/list/use-month-category-totals.ts";
import { cn } from "#/lib/cn.ts";

interface CategoryChipsProps {
    className?: string;
}

/** Filter chips for the month's categories, below expanded windows. */
export function CategoryChips({ className }: CategoryChipsProps) {
    const totals = useMonthCategoryTotals();

    if (totals.length === 0) {
        return null;
    }
    return (
        <div className={cn("flex gap-2 overflow-x-auto px-4 py-1", className)}>
            {totals.map(({ category }) => (
                <Badge key={category.id} variant={"md3"} asChild>
                    <CategoryLink
                        categoryId={category.id}
                        className={`data-active:border-transparent
                        data-active:bg-secondary-container
                        data-active:text-on-secondary-container`}
                    >
                        <span
                            aria-hidden
                            className={"size-2.5 shrink-0 rounded-full"}
                            style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                    </CategoryLink>
                </Badge>
            ))}
        </div>
    );
}
