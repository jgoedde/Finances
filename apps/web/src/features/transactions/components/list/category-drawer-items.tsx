import { getLocale } from "#/paraglide/runtime.js";
import { formatCurrency } from "@finances/shared";
import { CategoryLink } from "#/features/transactions/components/list/category-link.tsx";
import { useMonthCategoryTotals } from "#/features/transactions/components/list/use-month-category-totals.ts";

/** The month's categories under "Transactions" in the drawer, like labels. */
export function CategoryDrawerItems() {
    const totals = useMonthCategoryTotals();

    return (
        <div className={"flex flex-col"}>
            {totals.map(({ category, total }) => (
                <CategoryLink
                    key={category.id}
                    categoryId={category.id}
                    className={`state-layer flex h-12 shrink-0 items-center
                    gap-3 rounded-full pr-4 pl-12 text-label-large
                    text-on-surface-variant focus-ring
                    data-active:bg-secondary-container
                    data-active:text-on-secondary-container`}
                >
                    <span
                        aria-hidden
                        className={"size-2.5 shrink-0 rounded-full"}
                        style={{ backgroundColor: category.color }}
                    />
                    <span className={"min-w-0 grow truncate"}>
                        {category.name}
                    </span>
                    <span className={"text-label-medium"}>
                        {formatCurrency(total, getLocale())}
                    </span>
                </CategoryLink>
            ))}
        </div>
    );
}
