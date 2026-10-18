import type { Ref } from "react";
import { CheckIcon } from "lucide-react";
import type { Category } from "@finances/shared";
import { Badge } from "#/components/ui/badge.tsx";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

/**
 * Share of the category's color in a selected chip's tint.
 */
const SELECTED_TINT_SHARE = "28%";

interface CategoryChipsProps {
    ref?: Ref<HTMLDivElement>;
    categories: Category[];
    selectedCategoryId: string | undefined;
    onSelect: (categoryId: string) => void;
    error: string | undefined;
}

/**
 * Single-select filter chips for the categories, in the user's order. The
 * order never changes, so the thumb learns where each category sits.
 */
export function CategoryChips({
    ref,
    categories,
    selectedCategoryId,
    onSelect,
    error,
}: CategoryChipsProps) {
    return (
        <Field data-invalid={error !== undefined}>
            <FieldLabel id={"category-label"}>
                {m.transaction_category()}
            </FieldLabel>
            <div
                ref={ref}
                role={"group"}
                aria-labelledby={"category-label"}
                className={"flex flex-wrap gap-2"}
            >
                {categories.map((category) => {
                    const isSelected = category.id === selectedCategoryId;

                    return (
                        <Badge key={category.id} asChild variant={"md3"}>
                            <button
                                type={"button"}
                                aria-pressed={isSelected}
                                className={cn(
                                    "pl-2",
                                    isSelected &&
                                        "border-transparent text-on-surface",
                                )}
                                style={
                                    isSelected
                                        ? {
                                              backgroundColor: `color-mix(in oklab, ${category.color} ${SELECTED_TINT_SHARE}, transparent)`,
                                          }
                                        : undefined
                                }
                                onClick={() => onSelect(category.id)}
                            >
                                {isSelected ? (
                                    <CheckIcon aria-hidden />
                                ) : (
                                    <span
                                        aria-hidden
                                        className={"mx-1 size-2.5 rounded-full"}
                                        style={{
                                            backgroundColor: category.color,
                                        }}
                                    />
                                )}
                                {category.name}
                            </button>
                        </Badge>
                    );
                })}
            </div>
            {error !== undefined && (
                <p className={"px-4 text-body-small text-error"}>{error}</p>
            )}
        </Field>
    );
}
