import type { KeyboardEvent } from "react";
import { Input } from "#/components/ui/input.tsx";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { m } from "#/paraglide/messages.js";

interface NameStepProps {
    value: string;
    onChange: (name: string) => void;
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export function NameStep({ value, onChange, onKeyDown }: NameStepProps) {
    return (
        <Field>
            <FieldLabel htmlFor={"name"}>{m.fixed_cost_name()}</FieldLabel>
            <Input
                id={"name"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={m.fixed_cost_name_placeholder()}
                autoFocus
                autoComplete={"off"}
                enterKeyHint={"next"}
                onKeyDown={onKeyDown}
            />
        </Field>
    );
}
