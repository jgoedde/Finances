import { formatCurrency, formatPercent } from "@finances/shared";
import { Link } from "@tanstack/react-router";
import type { CategoryOverview } from "@finances/shared";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface CategoryBarProps {
    category: CategoryOverview;

    /**
     * The amount a full-width bar stands for.
     */
    scale: number;
}

/**
 * Share of the category's color in the row tint, over the card's surface:
 * just a hint of it.
 */
const TINT_SHARE = "12%";

/**
 * A category's spending as a bar, with a tick at its typical month. Opens
 * the month's transactions of the category.
 */
export function CategoryBar({ category, scale }: CategoryBarProps) {
    const { total, typical } = category;
    const width = (value: number) => `${(Math.max(value, 0) / scale) * 100}%`;
    const change =
        typical !== null && typical > 0 ? (total - typical) / typical : null;

    return (
        <Link
            to={"/transactions"}
            search={{
                category: category.categoryId,
                q: undefined,
                older: undefined,
            }}
            className={`state-layer flex flex-col gap-2 rounded-md px-3 py-2
                focus-ring`}
            style={{
                backgroundColor: `color-mix(in oklab, ${category.categoryColor} ${TINT_SHARE}, transparent)`,
            }}
        >
            <div className={"flex items-center gap-3"}>
                <span
                    aria-hidden
                    className={"size-2.5 shrink-0 rounded-full"}
                    style={{ backgroundColor: category.categoryColor }}
                />
                <span
                    className={
                        "min-w-0 grow truncate text-body-large text-on-surface"
                    }
                >
                    {category.categoryName}
                </span>
                <span className={"text-label-large text-on-surface"}>
                    {formatCurrency(total, getLocale())}
                </span>
            </div>
            <div className={"flex items-center gap-3 pl-5.5"}>
                <div
                    className={`relative h-2 grow rounded-full
                        bg-surface-container-highest`}
                >
                    <div
                        className={"h-full rounded-full bg-primary"}
                        style={{ width: width(total) }}
                    />
                    {typical !== null && typical > 0 && (
                        <div
                            aria-hidden
                            className={`absolute -top-1 h-4 w-0.5 rounded-full
                            bg-on-surface`}
                            style={{ left: width(typical) }}
                        />
                    )}
                </div>
                <span
                    className={`w-28 shrink-0 text-right text-label-medium
                        text-on-surface-variant`}
                >
                    {change !== null &&
                        m.overview_vs_typical({
                            change: formatPercent(change, getLocale(), {
                                signed: true,
                            }),
                        })}
                </span>
            </div>
        </Link>
    );
}
