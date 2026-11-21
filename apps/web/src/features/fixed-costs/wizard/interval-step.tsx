import type { FixedCostInterval } from "@finances/shared";
import { SegmentedButton } from "#/components/ui/segmented-button.tsx";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { INTERVAL_LABELS } from "#/features/fixed-costs/fixed-cost.ts";
import { m } from "#/paraglide/messages.js";

interface IntervalStepProps {
    value: FixedCostInterval;
    onChange: (interval: FixedCostInterval) => void;
}

export function IntervalStep({ value, onChange }: IntervalStepProps) {
    return (
        <Field>
            <FieldLabel>{m.fixed_cost_interval()}</FieldLabel>
            <SegmentedButton
                options={Object.entries(INTERVAL_LABELS).map(
                    ([interval, label]) => ({
                        label: label(),
                        value: interval,
                    }),
                )}
                value={value}
                onChange={(v) => onChange(v as FixedCostInterval)}
            />
        </Field>
    );
}
