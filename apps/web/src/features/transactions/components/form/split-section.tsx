import type { Category } from "@finances/shared";
import SplitIcon from "~icons/material-symbols/call-split-rounded";
import { Button } from "#/components/ui/button.tsx";
import { SplitPartRow } from "#/features/transactions/components/form/split-part-row.tsx";
import { SplitRemainder } from "#/features/transactions/components/form/split-remainder.tsx";
import { findMissingInPart } from "#/features/transactions/components/form/transaction-form-model.ts";
import type { useSplitParts } from "#/features/transactions/components/form/use-split-parts.ts";
import { m } from "#/paraglide/messages.js";

interface SplitSectionProps {
    split: ReturnType<typeof useSplitParts>;
    categories: Category[];

    /**
     * The main transaction's category, which keeps the remainder.
     */
    selectedCategory: Category | undefined;
}

/**
 * The parts split off the total, what the total keeps and a button to add
 * another part.
 */
export function SplitSection({
    split,
    categories,
    selectedCategory,
}: SplitSectionProps) {
    const { parts, remainder } = split;
    return (
        <div className={"flex flex-col gap-3"}>
            {/* Above the parts: the main transaction keeps what they leave. */}
            {parts.length > 0 && remainder !== undefined && (
                <SplitRemainder
                    remainder={remainder}
                    isInvalid={split.isRemainderInvalid}
                    category={selectedCategory}
                />
            )}
            {parts.map((part) => (
                <SplitPartRow
                    key={part.key}
                    part={part}
                    categories={categories}
                    onChange={split.update}
                    onRemove={() => split.remove(part.key)}
                    missing={
                        split.shouldShowErrors
                            ? findMissingInPart(part)
                            : undefined
                    }
                />
            ))}
            <Button
                type={"button"}
                variant={"text"}
                className={"-ml-3 self-start"}
                onClick={split.add}
            >
                <SplitIcon aria-hidden />
                {m.transaction_split()}
            </Button>
        </div>
    );
}
