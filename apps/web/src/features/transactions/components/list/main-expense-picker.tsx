import { createCallable } from "react-call";
import { formatCurrency, type Transaction } from "@finances/shared";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "#/components/ui/alert-dialog.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

/**
 * Matches the exit animation of `AlertDialogContent`.
 */
const UNMOUNTING_DELAY_MS = 200;

interface MainExpensePickerProps {
    /**
     * The expenses to choose from.
     */
    candidates: Transaction[];
}

/**
 * MD3 simple dialog for choosing the main expense to attach an expense to.
 * Mount it once (see `routes/__root.tsx`) and open it with
 * `chooseMainExpense()`.
 */
export const MainExpensePicker = createCallable<
    MainExpensePickerProps,
    Transaction | undefined
>(
    ({ call, candidates }) => (
        <AlertDialog
            open={!call.ended}
            onOpenChange={(open) => {
                if (!open) {
                    call.end(undefined);
                }
            }}
        >
            <AlertDialogContent onOverlayClick={() => call.end(undefined)}>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {m.transaction_attach_title()}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {candidates.length > 0
                            ? m.transaction_attach_description()
                            : m.transaction_attach_none()}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {candidates.length > 0 && (
                    <ul
                        className={
                            "-mx-6 flex max-h-80 flex-col overflow-y-auto"
                        }
                    >
                        {candidates.map((candidate) => (
                            <li key={candidate.id}>
                                <button
                                    type={"button"}
                                    className={`state-layer flex min-h-14 w-full
                                    cursor-pointer items-center gap-4 px-6 py-2
                                    text-left focus-ring`}
                                    onClick={() => call.end(candidate)}
                                >
                                    <span
                                        className={
                                            "flex min-w-0 flex-1 flex-col"
                                        }
                                    >
                                        <span
                                            className={`text-body-large
                                            text-on-surface`}
                                        >
                                            {candidate.counterparty}
                                        </span>
                                        {candidate.description !== null && (
                                            <span
                                                className={`truncate
                                                text-body-medium
                                                text-on-surface-variant`}
                                            >
                                                {candidate.description}
                                            </span>
                                        )}
                                    </span>
                                    <span
                                        className={
                                            "text-label-large text-on-surface"
                                        }
                                    >
                                        {formatCurrency(
                                            candidate.amount,
                                            getLocale(),
                                        )}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel>{m.action_cancel()}</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ),
    UNMOUNTING_DELAY_MS,
);

/**
 * Asks which of `candidates` to attach an expense to; `undefined` when
 * cancelled.
 */
export function chooseMainExpense(
    candidates: Transaction[],
): Promise<Transaction | undefined> {
    return MainExpensePicker.call({ candidates });
}
