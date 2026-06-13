import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { type KeyboardEvent, useMemo, useState } from "react";
import { BackArrowButton } from "@/components/ui/back-arrow-button.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { fixedCostRepository } from "@/features/fixed-costs/fixed-costs-repository.ts";
import type { FixedCost } from "@/persistence/types.ts";
import { toast } from "sonner";
import { z } from "zod";
import {
    ButtonGroup,
    ButtonGroupSeparator,
} from "@/components/ui/button-group.tsx";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import { useFixedCostCategories } from "@/features/fixed-costs/use-fixed-cost-categories.ts";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field.tsx";
import { CurrencyInputWrapper } from "@/components/ui/currency-input-wrapper.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/cn.ts";

class FixedCostNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FixedCostNotFoundError";
    }
}

const routeParamsSchema = z.object({
    id: z.coerce.number(),
});

export const Route = createFileRoute("/fixed-costs/$id")({
    component: RouteComponent,
    params: { parse: (p) => routeParamsSchema.parse(p) },
    loader: (a) => {
        const t = fixedCostRepository.findById(a.params.id);
        if (t === undefined) {
            throw new FixedCostNotFoundError("fixed cost not found");
        }

        return t;
    },
    onError: (error) => {
        if (error instanceof FixedCostNotFoundError) {
            toast.error("Fixkostenstelle nicht gefunden.");
            throw redirect({ to: "/" });
        }

        toast.error(
            "Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es erneut.",
        );
        throw redirect({ to: "/" });
    },
});

type StepId =
    | "name"
    | "amount"
    | "interval"
    | "startDate"
    | "endDate"
    | "category";

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
    const fixedCost = Route.useLoaderData();

    const [step, setStep] = useState<number>(0);

    const [name, setName] = useState(fixedCost.name);
    const [amountStr, setAmountStr] = useState(() =>
        fixedCost.amount === 0 ? "" : fixedCost.amount.toFixed(2),
    );
    const [interval, setInterval] = useState<FixedCost["interval"]>(
        fixedCost.interval,
    );
    const [startDate, setStartDate] = useState<Date>(fixedCost.startDate);
    const [endDate, setEndDate] = useState<Date | undefined>(
        fixedCost.endDate ?? undefined,
    );
    const [categoryId, setCategoryId] = useState(fixedCost.category.id);

    const categories = useFixedCostCategories();

    const stepId = STEPS[step]?.id;

    const canNext = useMemo(() => {
        if (stepId === "name") {
            return name.trim().length > 0;
        }
        return true;
    }, [name, stepId]);

    function goNext() {
        if (!canNext) return;
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
            await fixedCostRepository.update(id, {
                name,
                amount: parseFloat(amountStr.replace(",", ".")),
                interval,
                start_date: startDate.toISOString(),
                end_date: endDate === undefined ? null : endDate.toISOString(),
                category_id: categoryId,
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
                        <FieldLabel htmlFor={"interval"}>Turnus</FieldLabel>
                        <ButtonGroup id={"interval"}>
                            <Button
                                variant={
                                    interval === "monthly"
                                        ? "filled"
                                        : "filledTonal"
                                }
                                onClick={() => setInterval("monthly")}
                            >
                                Monatlich
                            </Button>
                            <ButtonGroupSeparator />
                            <Button
                                variant={
                                    interval === "quarterly"
                                        ? "filled"
                                        : "filledTonal"
                                }
                                onClick={() => setInterval("quarterly")}
                            >
                                Quartalsweise
                            </Button>
                            <ButtonGroupSeparator />

                            <Button
                                variant={
                                    interval === "yearly"
                                        ? "filled"
                                        : "filledTonal"
                                }
                                onClick={() => setInterval("yearly")}
                            >
                                Jährlich
                            </Button>
                        </ButtonGroup>
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
                                    variant="outline"
                                    className="justify-between rounded-none text-left font-normal"
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
                                    variant="outline"
                                    data-empty={!endDate}
                                    className="data-[empty=true]:text-outline-variant justify-between rounded-none text-left font-normal"
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
                            value={String(categoryId)}
                            onValueChange={(c) => setCategoryId(Number(c))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Wähle eine Kategorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Kategorien</SelectLabel>
                                    {categories.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={String(c.id)}
                                        >
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
        // Mobile-only full screen wizard. Hidden on medium+ screens.
        <div className="flex min-h-screen flex-col md:hidden">
            <header
                className={
                    "bg-surface-container flex h-16 w-dvw items-center py-2"
                }
            >
                <BackArrowButton />
                <div className={"text-lg"}>Fixkosten bearbeiten</div>
            </header>

            <main className="flex flex-1 items-center justify-center">
                <div
                    className={cn(
                        stepId === "interval"
                            ? "mx-auto max-w-md"
                            : "mx-auto w-62",
                    )}
                >
                    {renderStep()}
                </div>
            </main>

            <footer className="border-t p-4">
                <div className="flex gap-2">
                    {step > 0 && (
                        <Button
                            variant="outline"
                            onClick={goPrev}
                            className="flex-1"
                        >
                            Zurück
                        </Button>
                    )}
                    <Button
                        onClick={goNext}
                        className="flex-1"
                        disabled={!canNext}
                    >
                        {step < STEPS.length - 1 ? "Weiter" : "Aktualisieren"}
                    </Button>
                </div>
            </footer>
        </div>
    );
}
