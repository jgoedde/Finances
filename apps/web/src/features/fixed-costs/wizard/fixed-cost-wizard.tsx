import { type KeyboardEvent, useMemo, useState } from "react";
import type { FixedCostCategory, FixedCostInterval } from "@finances/shared";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import * as haptics from "#/lib/haptics.ts";
import { toLocalIsoDate } from "#/features/fixed-costs/fixed-cost.ts";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import {
    type FixedCostWizardValues,
    STEPS,
} from "#/features/fixed-costs/wizard/fixed-cost-wizard-model.ts";
import { NameStep } from "#/features/fixed-costs/wizard/name-step.tsx";
import { AmountStep } from "#/features/fixed-costs/wizard/amount-step.tsx";
import { CategoryStep } from "#/features/fixed-costs/wizard/category-step.tsx";
import { IntervalStep } from "#/features/fixed-costs/wizard/interval-step.tsx";
import { DateStep } from "#/features/fixed-costs/wizard/date-step.tsx";
import { WizardFooter } from "#/features/fixed-costs/wizard/wizard-footer.tsx";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

interface FixedCostWizardProps {
    title: string;

    /**
     * Label of the final step's button.
     */
    submitLabel: string;
    initialValues: {
        name: string;
        amount: number | null;
        interval: FixedCostInterval;

        /**
         * Defaults to today.
         */
        startDate?: Date;
        endDate: Date | null;
        categoryId: string | undefined;
    };
    categories: FixedCostCategory[];

    /**
     * Saves the fixed cost optimistically; errors are the caller's to report.
     */
    onSubmit: (values: FixedCostWizardValues) => void;
}

/**
 * Step-by-step form for creating or editing a fixed cost.
 */
export function FixedCostWizard({
    title,
    submitLabel,
    initialValues,
    categories,
    onSubmit,
}: FixedCostWizardProps) {
    const [step, setStep] = useState<number>(0);

    const [name, setName] = useState(initialValues.name);
    const [amountStr, setAmountStr] = useState(() =>
        initialValues.amount ? initialValues.amount.toFixed(2) : "",
    );
    const [interval, setInterval] = useState<FixedCostInterval>(
        initialValues.interval,
    );
    const [startDate, setStartDate] = useState<Date>(
        () => initialValues.startDate ?? new Date(),
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        initialValues.endDate ?? undefined,
    );
    const [categoryId, setCategoryId] = useState(initialValues.categoryId);

    const stepId = STEPS[step];
    const isLastStep = step === STEPS.length - 1;
    // Fixed costs are read-only offline; only saving needs the server.
    const isOnline = useIsOnline();
    const isSaveBlocked = isLastStep && !isOnline;

    const canNext = useMemo(() => {
        if (stepId === "name") {
            return name.trim().length > 0;
        }
        if (stepId === "category") {
            return categoryId !== undefined;
        }
        return true;
    }, [name, categoryId, stepId]);

    function goNext() {
        if (isSaveBlocked) return;
        if (!canNext) {
            haptics.error();
            return;
        }
        if (step < STEPS.length - 1) {
            setStep((s) => s + 1);
            return;
        }
        submit();
    }

    function goPrev() {
        if (step > 0) setStep((s) => s - 1);
    }

    function submit() {
        if (categoryId === undefined) {
            haptics.error();
            return;
        }
        haptics.saved();
        onSubmit({
            name: name.trim(),
            amount: parseFloat(amountStr.replace(",", ".")) || 0,
            interval,
            startDate: toLocalIsoDate(startDate),
            endDate: endDate === undefined ? null : toLocalIsoDate(endDate),
            categoryId,
        });
    }

    // Input views for each step
    function renderStep() {
        switch (stepId) {
            case undefined:
                return null;
            case "name":
                return (
                    <NameStep
                        value={name}
                        onChange={setName}
                        onKeyDown={goNextOnKeyDown}
                    />
                );
            case "amount":
                return (
                    <AmountStep
                        value={amountStr}
                        onChange={setAmountStr}
                        onKeyDown={goNextOnKeyDown}
                    />
                );
            case "interval":
                return <IntervalStep value={interval} onChange={setInterval} />;
            case "startDate":
                return (
                    <DateStep
                        id={"start-date"}
                        label={m.fixed_cost_start_date()}
                        value={startDate}
                        onSelect={(d) => setStartDate(d ?? new Date())}
                        placeholder={m.fixed_cost_choose_start_date()}
                    />
                );
            case "endDate":
                return (
                    <DateStep
                        id={"end-date"}
                        label={m.fixed_cost_end_date()}
                        value={endDate}
                        onSelect={setEndDate}
                        placeholder={m.fixed_cost_end_date_optional()}
                        hint={m.fixed_cost_end_date_hint()}
                    />
                );
            case "category":
                return (
                    <CategoryStep
                        value={categoryId}
                        onChange={setCategoryId}
                        categories={categories}
                    />
                );
            default:
                throw new Error(
                    `unreachable error - type ${String(stepId satisfies never)}`,
                );
        }
    }

    const goNextOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            goNext();
        }
    };

    return (
        <div className="flex min-h-dvh flex-col">
            <TopAppBar title={title} />

            <main className="flex flex-1 items-center justify-center">
                <div
                    className={cn(
                        "mx-auto w-full px-4",
                        stepId === "interval" ? "max-w-md" : "max-w-xs",
                    )}
                >
                    {renderStep()}
                </div>
            </main>

            <WizardFooter
                canGoBack={step > 0}
                onBack={goPrev}
                onNext={goNext}
                canNext={canNext}
                isSaveBlocked={isSaveBlocked}
                nextLabel={isLastStep ? submitLabel : m.action_next()}
            />
        </div>
    );
}
