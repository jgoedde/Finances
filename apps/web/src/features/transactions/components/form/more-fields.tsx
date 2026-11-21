import { useState } from "react";
import ChevronDownIcon from "~icons/material-symbols/keyboard-arrow-down-rounded";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import { Checkbox } from "#/components/ui/checkbox.tsx";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

interface MoreFieldsProps {
    description: string;
    onDescriptionChange: (description: string) => void;
    isExceptional: boolean;
    onExceptionalChange: (isExceptional: boolean) => void;
    defaultOpen: boolean;
}

/**
 * The rarely needed fields, tucked away behind a toggle: description and
 * the exceptional flag.
 */
export function MoreFields({
    description,
    onDescriptionChange,
    isExceptional,
    onExceptionalChange,
    defaultOpen,
}: MoreFieldsProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={"flex flex-col gap-4"}>
            <Button
                type={"button"}
                variant={"text"}
                className={"-ml-3 self-start"}
                aria-expanded={isOpen}
                aria-controls={"transaction-more"}
                onClick={() => setIsOpen((open) => !open)}
            >
                {m.transaction_more()}
                <ChevronDownIcon
                    aria-hidden
                    className={cn(
                        "transition-transform duration-200 ease-standard",
                        isOpen && "rotate-180",
                    )}
                />
            </Button>
            {isOpen && (
                <div id={"transaction-more"} className={"flex flex-col gap-4"}>
                    <Field>
                        <FieldLabel htmlFor={"description"}>
                            {m.transaction_description()}
                        </FieldLabel>
                        <Input
                            id={"description"}
                            name={"description"}
                            value={description}
                            onChange={(e) => {
                                onDescriptionChange(e.target.value);
                            }}
                            type={"text"}
                        />
                    </Field>
                    <div className={"flex items-center gap-x-4"}>
                        <Checkbox
                            id={"exceptional"}
                            name={"exceptional"}
                            checked={isExceptional}
                            onCheckedChange={(checked) =>
                                onExceptionalChange(checked === true)
                            }
                        />
                        <Label
                            htmlFor={"exceptional"}
                            className={"text-body-large text-on-surface"}
                        >
                            {m.transaction_exceptional()}
                        </Label>
                    </div>
                </div>
            )}
        </div>
    );
}
