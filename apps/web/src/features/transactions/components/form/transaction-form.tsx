import { DeleteButton } from "#/components/delete-button.tsx";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { CategoryChips } from "#/features/transactions/components/form/category-chips.tsx";
import { DateChips } from "#/features/transactions/components/form/date-chips.tsx";
import { KindField } from "#/features/transactions/components/form/kind-field.tsx";
import { AmountCounterpartyFields } from "#/features/transactions/components/form/amount-counterparty-fields.tsx";
import { SplitSection } from "#/features/transactions/components/form/split-section.tsx";
import { MoreFields } from "#/features/transactions/components/form/more-fields.tsx";
import { SaveFooter } from "#/features/transactions/components/form/save-footer.tsx";
import { useTransactionForm } from "#/features/transactions/components/form/use-transaction-form.ts";
import type {
    InitialFormValues,
    TransactionFormRelation,
    TransactionFormSubmitData,
} from "#/features/transactions/components/form/transaction-form-model.ts";
import { m } from "#/paraglide/messages.js";

interface TransactionFormProps {
    initialValues: InitialFormValues;
    onDelete?: VoidFunction;
    onSubmit: (data: TransactionFormSubmitData) => void;
    title: string;

    /**
     * Offer splitting the total across categories (new transactions only).
     */
    canSplit?: boolean;
    relation?: TransactionFormRelation;
}

/**
 * Form for creating or editing a transaction: amount, counterparty and
 * category first, everything else prefilled or tucked away.
 */
export function TransactionForm({
    initialValues,
    onDelete,
    onSubmit,
    title,
    canSplit = false,
    relation,
}: TransactionFormProps) {
    const {
        amountInputRef,
        counterpartyInputRef,
        categoryChipsRef,
        entry,
        split,
        missingFields,
        counterpartyError,
        transactionType,
        categoryId,
        categoriesOfKind,
        selectedCategory,
        kindLockHint,
        dateLockHint,
        amountStr,
        changeAmount,
        date,
        setDate,
        description,
        setDescription,
        isExceptional,
        setIsExceptional,
        handleFormSubmit,
        onKindChange,
        onCategorySelect,
    } = useTransactionForm({ initialValues, onSubmit, relation });

    return (
        <form onSubmit={handleFormSubmit} className={"flex min-h-dvh flex-col"}>
            <TopAppBar
                title={title}
                actions={
                    typeof onDelete === "function" && (
                        <DeleteButton
                            title={m.transaction_delete_title()}
                            description={m.transaction_delete_description()}
                            onDelete={onDelete}
                        />
                    )
                }
            />

            <div
                className={`mx-auto flex w-full max-w-md grow flex-col gap-6
                    px-4 pt-2 pb-6`}
            >
                <KindField
                    value={transactionType}
                    onChange={onKindChange}
                    lockHint={kindLockHint}
                />

                <AmountCounterpartyFields
                    amountInputRef={amountInputRef}
                    counterpartyInputRef={counterpartyInputRef}
                    amountStr={amountStr}
                    onAmountChange={changeAmount}
                    isAmountMissing={missingFields.includes("amount")}
                    // Prefilled from a link, the keyboard would only cover
                    // the save button.
                    autoFocusAmount={initialValues.amount === undefined}
                    entry={entry}
                    kind={transactionType}
                    counterpartyError={counterpartyError}
                />

                <CategoryChips
                    ref={categoryChipsRef}
                    categories={categoriesOfKind}
                    selectedCategoryId={categoryId}
                    onSelect={onCategorySelect}
                    error={
                        missingFields.includes("category")
                            ? m.transaction_category_missing()
                            : undefined
                    }
                />

                {canSplit && (
                    <SplitSection
                        split={split}
                        categories={categoriesOfKind}
                        selectedCategory={selectedCategory}
                    />
                )}

                <DateChips
                    date={date}
                    onChange={setDate}
                    disabled={dateLockHint !== undefined}
                    hint={dateLockHint}
                />

                <MoreFields
                    description={description}
                    onDescriptionChange={setDescription}
                    isExceptional={isExceptional}
                    onExceptionalChange={setIsExceptional}
                    defaultOpen={
                        initialValues.description !== "" ||
                        initialValues.isExceptional
                    }
                />
            </div>

            <SaveFooter />
        </form>
    );
}
