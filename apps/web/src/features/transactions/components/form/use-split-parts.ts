import { useState } from "react";
import { nanoid } from "nanoid";
import { splitRemainder } from "@finances/shared";
import type { SplitPartDraft } from "#/features/transactions/components/form/split-part-row.tsx";
import { parseAmount } from "#/features/transactions/components/form/transaction-form-model.ts";

/**
 * The parts split off a transaction's total and what the total keeps.
 *
 * @param total The entered total, `NaN` when it isn't a number.
 */
export function useSplitParts(total: number) {
    const [parts, setParts] = useState<SplitPartDraft[]>([]);
    const [shouldShowErrors, setShouldShowErrors] = useState(false);

    const remainder = isNaN(total)
        ? undefined
        : splitRemainder(
              total,
              parts
                  .map((part) => parseAmount(part.amountStr))
                  .filter((amount) => amount > 0),
          );
    const isRemainderInvalid =
        parts.length > 0 && remainder !== undefined && remainder <= 0;

    function add() {
        // A new, empty part isn't an error yet.
        setShouldShowErrors(false);
        setParts((current) => [
            ...current,
            {
                key: `part-${nanoid(6)}`,
                amountStr: "",
                categoryId: undefined,
                description: "",
            },
        ]);
    }

    function update(updated: SplitPartDraft) {
        setParts((current) =>
            current.map((part) => (part.key === updated.key ? updated : part)),
        );
    }

    function remove(key: string) {
        setParts((current) => current.filter((part) => part.key !== key));
    }

    function setCategoryOfAll(categoryId: string | undefined) {
        setParts((current) => current.map((part) => ({ ...part, categoryId })));
    }

    return {
        parts,
        remainder,
        isRemainderInvalid,
        shouldShowErrors,
        showErrors: () => setShouldShowErrors(true),
        add,
        update,
        remove,
        setCategoryOfAll,
    };
}
