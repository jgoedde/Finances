import { XIcon } from "lucide-react";
import type { Category } from "@finances/shared";
import { Button } from "#/components/ui/button.tsx";
import { CurrencyInputWrapper } from "#/components/ui/currency-input-wrapper.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

/**
 * A value a part can't be saved without.
 */
export type SplitPartField = "amount" | "category";

/**
 * A part split off the total, as entered.
 */
export interface SplitPartDraft {
    /**
     * Stable React key; also prefixes the input ids.
     */
    key: string;
    amountStr: string;
    categoryId: string | undefined;
    description: string;
}

interface SplitPartRowProps {
    part: SplitPartDraft;
    categories: Category[];
    onChange: (part: SplitPartDraft) => void;
    onRemove: VoidFunction;

    /**
     * The first missing value, shown once a save failed.
     */
    missing: SplitPartField | undefined;
}

/**
 * One part of a split: amount, category and an optional description.
 * Counterparty, date and kind come from the main transaction.
 */
export function SplitPartRow({
    part,
    categories,
    onChange,
    onRemove,
    missing,
}: SplitPartRowProps) {
    return (
        <div
            role={"group"}
            className={`flex flex-col gap-2 rounded-md border
                border-outline-variant p-3`}
        >
            <div className={"flex items-start gap-2"}>
                <CurrencyInputWrapper
                    id={`${part.key}-amount`}
                    aria-label={m.transaction_amount()}
                    inputMode={"decimal"}
                    intlConfig={{ locale: getLocale(), currency: "EUR" }}
                    allowNegativeValue={false}
                    decimalsLimit={2}
                    value={part.amountStr}
                    onValueChange={(value) =>
                        onChange({ ...part, amountStr: value ?? "" })
                    }
                    autoComplete={"off"}
                    autoFocus
                    aria-invalid={missing === "amount"}
                    className={"w-32 shrink-0"}
                />
                <Select
                    value={part.categoryId ?? ""}
                    onValueChange={(categoryId) =>
                        onChange({ ...part, categoryId })
                    }
                >
                    <SelectTrigger
                        id={`${part.key}-category`}
                        aria-label={m.transaction_category()}
                        aria-invalid={missing === "category"}
                        className={"min-w-0 grow"}
                    >
                        <SelectValue placeholder={m.transaction_category()} />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    type={"button"}
                    variant={"ghost"}
                    size={"icon"}
                    className={"mt-2 shrink-0"}
                    aria-label={m.transaction_split_remove()}
                    onClick={onRemove}
                >
                    <XIcon aria-hidden />
                </Button>
            </div>
            <Input
                aria-label={m.transaction_description()}
                placeholder={m.transaction_split_description()}
                value={part.description}
                onChange={(e) =>
                    onChange({ ...part, description: e.target.value })
                }
                type={"text"}
            />
            {missing !== undefined && (
                <p className={"px-4 text-body-small text-error"}>
                    {missing === "amount"
                        ? m.transaction_amount_missing()
                        : m.transaction_category_missing()}
                </p>
            )}
        </div>
    );
}
