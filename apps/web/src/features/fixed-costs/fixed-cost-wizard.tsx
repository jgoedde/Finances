import { type KeyboardEvent, useMemo, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import type { FixedCostCategory, FixedCostInterval } from "@finances/shared";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { SegmentedButton } from "#/components/ui/segmented-button.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Calendar } from "#/components/ui/calendar.tsx";
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
import { CurrencyInputWrapper } from "#/components/ui/currency-input-wrapper.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "#/components/ui/popover.tsx";
import {
    INTERVAL_LABELS,
    toLocalIsoDate,
} from "#/features/fixed-costs/fixed-cost.ts";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

// Popover triggers styled like an MD3 outlined text field.
const dateTriggerClassName = `border-outline text-on-surface text-body-large
    hover:border-on-surface h-14 w-full justify-between rounded-xs border px-4
    text-left [&_svg]:text-on-surface-variant`;

type StepId =
    "name" | "amount" | "interval" | "startDate" | "endDate" | "category";

const STEPS: StepId[] = [
    "name",
    "amount",
    "category",
    "interval",
    "startDate",
    "endDate",
];

export interface FixedCostWizardValues {
    name: string;
    amount: number;
    interval: FixedCostInterval;
    /** `YYYY-MM-DD` */
    startDate: string;
    /** `YYYY-MM-DD` */
    endDate: string | null;
    categoryId: string;
}

interface FixedCostWizardProps {
    title: string;
    /** Label of the final step's button. */
    submitLabel: string;
    initialValues: {
        name: string;
        amount: number | null;
        interval: FixedCostInterval;
        /** Defaults to today. */
        startDate?: Date;
        endDate: Date | null;
        categoryId: string | undefined;
    };
    categories: FixedCostCategory[];
    /** Saves the fixed cost optimistically; errors are the caller's to report. */
    onSubmit: (values: FixedCostWizardValues) => void;
}

/** Step-by-step form for creating or editing a fixed cost. */
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
        if (!canNext || isSaveBlocked) return;
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
            return;
        }
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
            case "name":
                return (
                    <Field>
                        <FieldLabel htmlFor={"name"}>
                            {m.fixed_cost_name()}
                        </FieldLabel>
                        <Input
                            id={"name"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={m.fixed_cost_name_placeholder()}
                            autoFocus
                            autoComplete={"off"}
                            enterKeyHint={"next"}
                            onKeyDown={goNextOnKeyDown}
                        />
                    </Field>
                );
            case "amount":
                return (
                    <Field>
                        <FieldLabel htmlFor={"amount"}>
                            {m.fixed_cost_amount_eur()}
                        </FieldLabel>
                        <CurrencyInputWrapper
                            id={"amount"}
                            inputMode={"decimal"}
                            intlConfig={{
                                locale: getLocale(),
                                currency: "EUR",
                            }}
                            required
                            allowNegativeValue={false}
                            onValueChange={(e) => setAmountStr(e ?? "")}
                            decimalsLimit={2}
                            value={amountStr}
                            step={0.01}
                            autoFocus
                            autoComplete={"off"}
                            enterKeyHint={"next"}
                            onKeyDown={goNextOnKeyDown}
                        />
                    </Field>
                );
            case "interval":
                return (
                    <Field>
                        <FieldLabel>{m.fixed_cost_interval()}</FieldLabel>
                        <SegmentedButton
                            options={Object.entries(INTERVAL_LABELS).map(
                                ([value, label]) => ({ label: label(), value }),
                            )}
                            value={interval}
                            onChange={(v) =>
                                setInterval(v as FixedCostInterval)
                            }
                        />
                    </Field>
                );
            case "startDate":
                return (
                    <Field>
                        <FieldLabel htmlFor={"start-date"}>
                            {m.fixed_cost_start_date()}
                        </FieldLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id={"start-date"}
                                    variant="ghost"
                                    shape="square"
                                    className={dateTriggerClassName}
                                >
                                    {startDate ? (
                                        startDate.toLocaleDateString(
                                            getLocale(),
                                            {
                                                dateStyle: "long",
                                            },
                                        )
                                    ) : (
                                        <span>
                                            {m.fixed_cost_choose_start_date()}
                                        </span>
                                    )}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(d) =>
                                        setStartDate(d ?? new Date())
                                    }
                                    defaultMonth={startDate}
                                />
                            </PopoverContent>
                        </Popover>
                    </Field>
                );
            case "endDate":
                return (
                    <Field>
                        <FieldLabel htmlFor={"end-date"}>
                            {m.fixed_cost_end_date()}
                        </FieldLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id={"end-date"}
                                    variant="ghost"
                                    shape="square"
                                    data-empty={!endDate}
                                    className={cn(
                                        dateTriggerClassName,
                                        "data-[empty=true]:text-on-surface-variant",
                                    )}
                                >
                                    {endDate ? (
                                        endDate.toLocaleDateString(
                                            getLocale(),
                                            {
                                                dateStyle: "long",
                                            },
                                        )
                                    ) : (
                                        <span>
                                            {m.fixed_cost_end_date_optional()}
                                        </span>
                                    )}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    defaultMonth={endDate}
                                />
                            </PopoverContent>
                        </Popover>
                        <FieldDescription>
                            {m.fixed_cost_end_date_hint()}
                        </FieldDescription>
                    </Field>
                );
            case "category":
                return (
                    <Field>
                        <FieldLabel>{m.fixed_cost_category()}</FieldLabel>
                        <Select
                            value={categoryId}
                            onValueChange={setCategoryId}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={m.fixed_cost_choose_category()}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        {m.fixed_cost_categories()}
                                    </SelectLabel>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FieldDescription>
                            {
                                categories.find((it) => it.id === categoryId)
                                    ?.description
                            }
                        </FieldDescription>
                    </Field>
                );

            default:
                return null;
        }
    }

    const goNextOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            goNext();
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
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

            <footer className="border-t border-outline-variant p-4">
                <div className="mx-auto flex w-full max-w-md gap-2">
                    {step > 0 && (
                        <Button
                            variant="outline"
                            onClick={goPrev}
                            className="flex-1"
                        >
                            {m.action_back()}
                        </Button>
                    )}
                    <OfflineHint active={isSaveBlocked}>
                        <Button
                            variant="filled"
                            onClick={goNext}
                            className="flex-1"
                            disabled={!canNext || isSaveBlocked}
                        >
                            {isLastStep ? submitLabel : m.action_next()}
                        </Button>
                    </OfflineHint>
                </div>
            </footer>
        </div>
    );
}
