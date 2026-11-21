import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { RadioGroup, RadioGroupSwatch } from "#/components/ui/radio-group.tsx";
import { CATEGORY_COLORS } from "#/features/categories/category-style.ts";
import { m } from "#/paraglide/messages.js";
import { paletteFromHex, toneStyle } from "#/utils/color.ts";

interface CategoryColorFieldProps {
    id: string;
    value: string;
    onChange: (color: string) => void;

    /**
     * The category's current color, which stays choosable when it isn't in
     * the palette.
     */
    initialColor: string;
}

/**
 * The category's color, from the palette.
 */
export function CategoryColorField({
    id,
    value,
    onChange,
    initialColor,
}: CategoryColorFieldProps) {
    const colors = CATEGORY_COLORS.includes(initialColor)
        ? CATEGORY_COLORS
        : [initialColor, ...CATEGORY_COLORS];

    return (
        <Field>
            <FieldLabel id={id}>{m.category_color()}</FieldLabel>
            <RadioGroup
                aria-labelledby={id}
                value={value}
                onValueChange={onChange}
                className={"grid-cols-[repeat(auto-fill,2.5rem)] gap-2"}
            >
                {colors.map((swatch, index) => (
                    <RadioGroupSwatch
                        key={swatch}
                        value={swatch}
                        aria-label={m.category_color_option({
                            number: index + 1,
                        })}
                        style={toneStyle(paletteFromHex(swatch))}
                    />
                ))}
            </RadioGroup>
        </Field>
    );
}
