import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { type KeyboardEvent, useMemo, useState } from "react";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { SegmentedButton } from "#/components/ui/segmented-button.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { FixedCostInterval } from "@finances/shared";
import {
    fixedCostCategoriesQuery,
    fixedCostQuery,
    useUpdateFixedCost,
} from "#/features/fixed-costs/fixed-cost-queries.ts";
import { toFixedCost, toIsoDate } from "#/features/fixed-costs/fixed-cost.ts";
import { ApiError } from "#/api/api-client.ts";
import { toast } from "sonner";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
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
import { ChevronDownIcon } from "lucide-react";
import { cn } from "#/lib/cn.ts";

export const Route = createFileRoute("/_authed/fixed-costs/$id")({
    component: RouteComponent,
    loader: ({ context, params }) =>
        Promise.all([
            context.queryClient.query({
                ...fixedCostQuery(params.id),
                staleTime: "static",
            }),
            context.queryClient.query({
                ...fixedCostCategoriesQuery,
                staleTime: "static",
            }),
        ]),
    onError: (error) => {
        if (error instanceof ApiError && error.status === 404) {
            toast.error("Fixkostenstelle nicht gefunden.");
            throw redirect({ to: "/" });
        }

        toast.error(
            "Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es erneut.",
        );
        throw redirect({ to: "/" });
    },
});

// Popover triggers styled like an MD3 outlined text field.
const dateTriggerClassName = `border-outline text-on-surface text-body-large
    hover:border-on-surface h-14 w-full justify-between rounded-xs border px-4
    text-left [&_svg]:text-on-surface-variant`;

type StepId =
    "name" | "amount" | "interval" | "startDate" | "endDate" | "category";

const STEPS: { id: StepId; title: string }[] = [
    { id: "name", title: "Bezeichnung" },
    { id: "amount", title: "Betrag" },
    { id: "category", title: "Kategorie" },
    { id: "interval", title: "Turnus" },
    { id: "startDate", title: "Startdatum" },
    { id: "endDate", title: "Enddatum" },
];

function RouteComponent() {
    const navigate = useNavigate();

    const { id } = Route.useParams();
    const { data: record } = useSuspenseQuery(fixedCostQuery(id));
    const { data: categories } = useSuspenseQuery(fixedCostCategoriesQuery);
    const fixedCost = toFixedCost(record, categories);
    const updateFixedCost = useUpdateFixedCost();

    const [step, setStep] = useState<number>(0);

    const [name, setName] = useState(fixedCost.name);
    const [amountStr, setAmountStr] = useState(() =>
        fixedCost.amount === 0 ? "" : fixedCost.amount.toFixed(2),
    );
    const [interval, setInterval] = useState<FixedCostInterval>(
        fixedCost.interval,
    );
    const [startDate, setStartDate] = useState<Date>(fixedCost.startDate);
    const [endDate, setEndDate] = useState<Date | undefined>(
        fixedCost.endDate ?? undefined,
    );
    const [categoryId, setCategoryId] = useState(record.categoryId);

    const stepId = STEPS[step]?.id;
    const isLastStep = step === STEPS.length - 1;
    // Fixed costs are read-only offline; only saving needs the server.
    const isOnline = useIsOnline();
    const isSaveBlocked = isLastStep && !isOnline;

    const canNext = useMemo(() => {
        if (stepId === "name") {
            return name.trim().length > 0;
        }
        return true;
    }, [name, stepId]);

    function goNext() {
        if (!canNext || isSaveBlocked) return;
        if (step < STEPS.length - 1) {
            setStep((s) => s + 1);
            return;
        }
        void submit();
    }

    function goPrev() {
        if (step > 0) setStep((s) => s - 1);
    }

    async function submit() {
        try {
            await updateFixedCost.mutateAsync({
                id,
                patch: {
                    name,
                    amount: parseFloat(amountStr.replace(",", ".")) || 0,
                    interval,
                    startDate: toIsoDate(startDate),
                    endDate: endDate === undefined ? null : toIsoDate(endDate),
                    categoryId,
                },
            });
            toast.success("Fixkosten aktualisiert");
            void navigate({ to: "/" });
        } catch {
            toast.error(
                "Die Fixkosten konnten nicht gespeichert werden. Bitte versuche es erneut.",
            );
        }
    }

    // Input views for each step
    function renderStep() {
        switch (stepId) {
            case "name":
                return (
                    <Field>
                        <FieldLabel htmlFor={"name"}>Bezeichnung</FieldLabel>
                        <Input
                            id={"name"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="z.B. Spotify"
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
                        <FieldLabel htmlFor={"amount"}>Betrag (EUR)</FieldLabel>
                        <CurrencyInputWrapper
                            id={"amount"}
                            inputMode={"decimal"}
                            intlConfig={{
                                locale: "de-DE",
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
                        <FieldLabel>Turnus</FieldLabel>
                        <SegmentedButton
                            options={[
                                { label: "Monatlich", value: "monthly" },
                                { label: "Quartalsweise", value: "quarterly" },
                                { label: "Jährlich", value: "yearly" },
                            ]}
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
                            Startdatum
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
                                        startDate.toLocaleDateString("de", {
                                            dateStyle: "long",
                                        })
                                    ) : (
                                        <span>Startdatum auswählen</span>
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
                        <FieldLabel htmlFor={"end-date"}>Enddatum</FieldLabel>
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
                                        endDate.toLocaleDateString("de", {
                                            dateStyle: "long",
                                        })
                                    ) : (
                                        <span>Enddatum (optional)</span>
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
                            Lass leer für unbefristet
                        </FieldDescription>
                    </Field>
                );
            case "category":
                return (
                    <Field>
                        <FieldLabel>Kategorie</FieldLabel>
                        <Select
                            value={categoryId}
                            onValueChange={setCategoryId}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Wähle eine Kategorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Kategorien</SelectLabel>
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
            <TopAppBar title={"Fixkosten bearbeiten"} />

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
                            Zurück
                        </Button>
                    )}
                    <OfflineHint active={isSaveBlocked}>
                        <Button
                            variant="filled"
                            onClick={goNext}
                            className="flex-1"
                            disabled={!canNext || isSaveBlocked}
                        >
                            {isLastStep ? "Aktualisieren" : "Weiter"}
                        </Button>
                    </OfflineHint>
                </div>
            </footer>
        </div>
    );
}
