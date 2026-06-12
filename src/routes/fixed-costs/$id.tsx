import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BackArrowButton } from "@/components/ui/back-arrow-button.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { fixedCostRepository } from "@/persistence/repositories/fixed-costs-repository.ts";
import type { FixedCost } from "@/persistence/types.ts";
import { toast } from "sonner";
import { z } from "zod";
import { CurrencyInput } from "react-currency-input-field";
import {
    ButtonGroup,
    ButtonGroupSeparator,
} from "@/components/ui/button-group.tsx";
import { Calendar } from "@/components/ui/calendar";
import { useCategories } from "@/components/transactions/use-categories.ts";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";

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
    const [amountStr, setAmountStr] = useState(fixedCost.amount.toFixed(2));
    const [interval, setInterval] = useState<FixedCost["interval"]>(
        fixedCost.interval,
    );
    const [startDate, setStartDate] = useState<Date>(fixedCost.startDate);
    const [endDate, setEndDate] = useState<Date | undefined>(
        fixedCost.endDate ?? undefined,
    );
    const [category, setCategory] = useState(fixedCost.category.id);

    const categories = useCategories();

    const stepId = STEPS[step].id;

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
                category_id: category,
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
                    <div className="mx-auto w-full max-w-md px-6">
                        <label className="text-muted-foreground mb-2 block text-sm">
                            Bezeichnung
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="z.B. Spotify"
                            autoFocus
                        />
                    </div>
                );
            case "amount":
                return (
                    <div className="mx-auto w-full max-w-md px-6">
                        <label className="text-muted-foreground mb-2 block text-sm">
                            Betrag (EUR)
                        </label>
                        <CurrencyInput
                            intlConfig={{
                                locale: "de-DE",
                                currency: "EUR",
                            }}
                            required
                            allowNegativeValue={false}
                            onValueChange={(e) => setAmountStr(e ?? "")}
                            decimalsLimit={2}
                            value={amountStr}
                            step={1}
                            autoFocus
                        />
                    </div>
                );
            case "interval":
                return (
                    <div className={"flex w-full justify-center"}>
                        <ButtonGroup className={""}>
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
                    </div>
                );
            case "startDate":
                return (
                    <div className="mx-auto w-full max-w-md px-6">
                        <label className="text-muted-foreground mb-2 block text-sm">
                            Startdatum
                        </label>
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(d) => setStartDate(d ?? new Date())}
                            className="rounded-lg"
                            captionLayout="dropdown"
                        />
                    </div>
                );
            case "endDate":
                return (
                    <div className="mx-auto w-full max-w-md px-6">
                        <label className="text-muted-foreground mb-2 block text-sm">
                            Enddatum (optional)
                        </label>
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            className="rounded-lg border"
                            captionLayout="dropdown"
                        />
                        <div className="text-muted-foreground mt-3 text-sm">
                            Lass leer für unbefristet
                        </div>
                    </div>
                );
            case "category":
                return (
                    <div className="mx-auto w-full max-w-md px-6">
                        <label className="text-muted-foreground mb-2 block text-sm">
                            Kategorie
                        </label>
                        <Select
                            value={String(category)}
                            onValueChange={(c) => setCategory(Number(c))}
                        >
                            <SelectTrigger className="w-full max-w-48">
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
                        </Select>{" "}
                    </div>
                );

            default:
                return null;
        }
    }

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
                <div className="w-full">
                    <div
                        className="text-muted-foreground mb-6 text-center
                            text-sm"
                    >
                        {STEPS[step].title}
                    </div>
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
