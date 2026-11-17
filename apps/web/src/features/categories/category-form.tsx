import { type SubmitEvent, useId, useState } from "react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { Button } from "#/components/ui/button.tsx";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
    RadioGroup,
    RadioGroupIconItem,
    RadioGroupSwatch,
} from "#/components/ui/radio-group.tsx";
import {
    CATEGORY_COLORS,
    searchCategoryIcons,
} from "#/features/categories/category-style.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { m } from "#/paraglide/messages.js";
import { paletteFromHex, toneStyle } from "#/utils/color.ts";

export interface CategoryFormValues {
    name: string;
    color: string;
    iconName: string;
}

interface CategoryFormProps {
    initialValues: CategoryFormValues;

    /**
     * For a fallback category: the name is shown but can't be changed.
     */
    isNameLocked?: boolean;
    submitLabel: string;

    /**
     * Offline: the form can be filled in but not submitted.
     */
    isOffline: boolean;

    /**
     * Saves the values (name trimmed); resolves to an error to show at the
     * name, such as a taken name, or `undefined` once saved.
     */
    onSubmit: (values: CategoryFormValues) => Promise<string | undefined>;
    onCancel: () => void;
}

/**
 * Name, color and icon of a category. Colors come from the palette and
 * icons from the curated list; a category's current color or icon stays
 * choosable when it isn't on them. Knows nothing about whose categories it
 * edits, so the admin's default categories can use it too.
 */
export function CategoryForm({
    initialValues,
    isNameLocked = false,
    submitLabel,
    isOffline,
    onSubmit,
    onCancel,
}: CategoryFormProps) {
    const id = useId();
    const [name, setName] = useState(initialValues.name);
    const [color, setColor] = useState(initialValues.color);
    const [iconName, setIconName] = useState(initialValues.iconName);
    const [iconSearch, setIconSearch] = useState("");
    const [nameError, setNameError] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const colors = CATEGORY_COLORS.includes(initialValues.color)
        ? CATEGORY_COLORS
        : [initialValues.color, ...CATEGORY_COLORS];
    const icons = searchCategoryIcons(iconSearch).map((icon) => icon.name);
    if (
        iconSearch.trim() === "" &&
        !icons.includes(initialValues.iconName as IconName)
    ) {
        icons.unshift(initialValues.iconName as IconName);
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmed = name.trim();
        if (!isNameLocked && trimmed === "") {
            setNameError(m.category_name_missing());
            return;
        }
        setIsSubmitting(true);
        try {
            setNameError(await onSubmit({ name: trimmed, color, iconName }));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            noValidate
            className={"flex flex-col gap-6"}
            onSubmit={(event) => void handleSubmit(event)}
        >
            <Field data-invalid={nameError !== undefined}>
                <FieldLabel htmlFor={`${id}-name`}>
                    {m.category_name()}
                </FieldLabel>
                <Input
                    id={`${id}-name`}
                    value={name}
                    disabled={isNameLocked}
                    aria-invalid={nameError !== undefined}
                    maxLength={40}
                    autoComplete={"off"}
                    onChange={(event) => {
                        setName(event.target.value);
                        setNameError(undefined);
                    }}
                />
                {nameError !== undefined ? (
                    <p className={"px-4 text-body-small text-error"}>
                        {nameError}
                    </p>
                ) : (
                    isNameLocked && (
                        <FieldDescription>
                            {m.category_fallback_hint()}
                        </FieldDescription>
                    )
                )}
            </Field>

            <Field>
                <FieldLabel id={`${id}-color`}>{m.category_color()}</FieldLabel>
                <RadioGroup
                    aria-labelledby={`${id}-color`}
                    value={color}
                    onValueChange={setColor}
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

            <Field>
                <FieldLabel id={`${id}-icon`}>{m.category_icon()}</FieldLabel>
                <Input
                    type={"search"}
                    aria-label={m.category_icon_search()}
                    placeholder={m.category_icon_search()}
                    value={iconSearch}
                    autoComplete={"off"}
                    onChange={(event) => setIconSearch(event.target.value)}
                />
                {icons.length > 0 ? (
                    <RadioGroup
                        aria-labelledby={`${id}-icon`}
                        value={iconName}
                        onValueChange={setIconName}
                        className={"grid-cols-[repeat(auto-fill,3rem)] gap-1"}
                    >
                        {icons.map((icon) => (
                            <RadioGroupIconItem
                                key={icon}
                                value={icon}
                                aria-label={icon}
                            >
                                <DynamicIcon name={icon} />
                            </RadioGroupIconItem>
                        ))}
                    </RadioGroup>
                ) : (
                    <p
                        className={
                            "px-4 text-body-medium text-on-surface-variant"
                        }
                    >
                        {m.category_icon_none()}
                    </p>
                )}
            </Field>

            <div className={"flex justify-end gap-2"}>
                <Button type={"button"} variant={"text"} onClick={onCancel}>
                    {m.action_cancel()}
                </Button>
                <OfflineHint active={isOffline}>
                    <Button
                        type={"submit"}
                        variant={"filled"}
                        disabled={isOffline || isSubmitting}
                    >
                        {submitLabel}
                    </Button>
                </OfflineHint>
            </div>
        </form>
    );
}
