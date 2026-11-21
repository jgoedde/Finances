import { Field, FieldDescription, FieldLabel } from "#/components/ui/field.tsx";
import { DatePickerButton } from "#/features/fixed-costs/date-picker-button.tsx";

interface DateStepProps {
    id: string;
    label: string;
    value: Date | undefined;
    onSelect: (day: Date | undefined) => void;

    /**
     * Shown without a value.
     */
    placeholder: string;
    hint?: string;
}

/**
 * The start or end date of a fixed cost.
 */
export function DateStep({
    id,
    label,
    value,
    onSelect,
    placeholder,
    hint,
}: DateStepProps) {
    return (
        <Field>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <DatePickerButton
                id={id}
                value={value}
                onSelect={onSelect}
                placeholder={placeholder}
            />
            {hint !== undefined && <FieldDescription>{hint}</FieldDescription>}
        </Field>
    );
}
