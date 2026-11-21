import type { FixedCostCategory } from "@finances/shared";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field.tsx";
import { m } from "#/paraglide/messages.js";

interface CategoryStepProps {
    value: string | undefined;
    onChange: (categoryId: string) => void;
    categories: FixedCostCategory[];
}

export function CategoryStep({
    value,
    onChange,
    categories,
}: CategoryStepProps) {
    return (
        <Field>
            <FieldLabel>{m.fixed_cost_category()}</FieldLabel>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={m.fixed_cost_choose_category()} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{m.fixed_cost_categories()}</SelectLabel>
                        {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                                {c.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <FieldDescription>
                {categories.find((it) => it.id === value)?.description}
            </FieldDescription>
        </Field>
    );
}
