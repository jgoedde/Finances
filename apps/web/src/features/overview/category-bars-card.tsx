import type { MonthOverview } from "@finances/shared";
import { Card } from "#/components/ui/card.tsx";
import { CategoryBar } from "#/features/overview/category-bar.tsx";
import { m } from "#/paraglide/messages.js";

interface CategoryBarsCardProps {
    overview: MonthOverview;
}

/** The month's categories, largest first, against their typical month. */
export function CategoryBarsCard({ overview }: CategoryBarsCardProps) {
    const { categories } = overview;
    const scale = Math.max(
        1,
        ...categories.flatMap(({ total, typical }) => [total, typical ?? 0]),
    );

    return (
        <Card className={"gap-2 px-2 py-4"}>
            <div className={"flex flex-col px-3"}>
                <h2 className={"font-brand text-title-large text-on-surface"}>
                    {m.overview_categories_title()}
                </h2>
                <span className={"text-body-small text-on-surface-variant"}>
                    {m.overview_categories_hint()}
                </span>
            </div>
            {categories.length === 0 ? (
                <p
                    className={`px-3 py-4 text-body-medium
                        text-on-surface-variant`}
                >
                    {m.overview_categories_empty()}
                </p>
            ) : (
                categories.map((category) => (
                    <CategoryBar
                        key={category.categoryId}
                        category={category}
                        scale={scale}
                    />
                ))
            )}
        </Card>
    );
}
