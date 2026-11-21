import { type SubmitEvent, useId, useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import { CategoryColorField } from "#/features/categories/category-color-field.tsx";
import { CategoryIconField } from "#/features/categories/category-icon-field.tsx";
import * as haptics from "#/lib/haptics.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { m } from "#/paraglide/messages.js";

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
    const [nameError, setNameError] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmed = name.trim();
        if (!isNameLocked && trimmed === "") {
            haptics.error();
            setNameError(m.category_name_missing());
            return;
        }
        setIsSubmitting(true);
        try {
            const error = await onSubmit({ name: trimmed, color, iconName });
            if (error === undefined) {
                haptics.saved();
            } else {
                haptics.error();
            }
            setNameError(error);
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

            <CategoryColorField
                id={`${id}-color`}
                value={color}
                onChange={setColor}
                initialColor={initialValues.color}
            />

            <CategoryIconField
                id={`${id}-icon`}
                value={iconName}
                onChange={setIconName}
                initialIconName={initialValues.iconName}
            />

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
