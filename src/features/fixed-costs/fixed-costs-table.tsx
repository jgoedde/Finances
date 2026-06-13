import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { fixedCostRepository } from "@/features/fixed-costs/fixed-costs-repository.ts";
import { Link } from "@tanstack/react-router";
import type { FixedCost } from "@/persistence/types.ts";
import { useTableSubscription } from "@/persistence/use-table-subscription.ts";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch.tsx";

const INTERVAL_LABELS: Record<FixedCost["interval"], string> = {
    monthly: "Monatlich",
    quarterly: "Quartalsweise",
    yearly: "Jährlich",
};

function toMonthlyLabel(amount: number, currency: string) {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency,
    }).format(amount);
}

export function FixedCostsTable() {
    const fixedCosts = useTableSubscription(
        () => fixedCostRepository.findAll(),
        [],
        "fixedCosts:changed",
    );

    async function toggleActive(row: FixedCost) {
        try {
            await fixedCostRepository.update(row.id, {
                active: row.active ? 0 : 1,
            });
            toast.success(
                "Die Fixkostenstelle ist nun " +
                    (row.active ? "deaktiviert" : "aktiv") +
                    ".",
            );
        } catch {
            toast.error(
                "Die Fixkostenstelle konnte nicht aktualisiert werden. Bitte versuche es erneut.",
            );
        }
    }

    async function remove(id: number) {
        if (!confirm("Möchtest Du diese Fixkostenstelle wirklich löschen?")) {
            return;
        }

        try {
            await fixedCostRepository.remove(id);
            toast.success("Die Fixkostenstelle wurde gelöscht");
        } catch {
            toast.error(
                "Die Fixkostenstelle konnte nicht gelöscht werden. Bitte versuche es erneut",
            );
        }
    }

    const monthlyTotal = fixedCostRepository.monthlyTotal();

    return (
        <div className="space-y-4">
            <Button
                variant={"filledTonal"}
                className={"ml-2"}
                onClick={async () => {
                    await fixedCostRepository.add({
                        active: 1,
                        amount: 0,
                        start_date: new Date().toISOString(),
                        category_id: 1,
                        currency: "EUR",
                        end_date: null,
                        name: "Leer",
                        description: null,
                        interval: "monthly",
                    });
                }}
            >
                <Plus />
                Fixkosten erfassen
            </Button>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Bezeichnung</TableHead>
                        <TableHead>Kategorie</TableHead>
                        <TableHead className="text-right">Betrag</TableHead>
                        <TableHead>Turnus</TableHead>
                        <TableHead className="text-right">/ Monat</TableHead>
                        <TableHead className="w-30" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fixedCosts.map((row) => (
                        <TableRow
                            key={row.id}
                            className={
                                !row.isRunning ? "opacity-50" : undefined
                            }
                        >
                            <TableCell className="font-medium">
                                <Link
                                    className={
                                        "inline-flex items-center gap-x-1"
                                    }
                                    to={`/fixed-costs/$id`}
                                    params={{ id: row.id }}
                                >
                                    {row.name}{" "}
                                    <ChevronRight
                                        className={"text-outline size-4"}
                                    />
                                </Link>
                            </TableCell>
                            <TableCell>
                                <span className="text-muted-foreground text-sm">
                                    {row.category.name}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                {toMonthlyLabel(row.amount, row.currency)}
                            </TableCell>
                            <TableCell>
                                <span className="text-muted-foreground text-xs">
                                    {INTERVAL_LABELS[row.interval]}
                                </span>
                            </TableCell>
                            <TableCell
                                className="text-muted-foreground text-right
                                    text-sm"
                            >
                                {toMonthlyLabel(
                                    row.monthlyAmount,
                                    row.currency,
                                )}
                            </TableCell>
                            <TableCell className="flex items-center gap-1">
                                <Switch
                                    checked={row.active}
                                    onCheckedChange={() => toggleActive(row)}
                                />
                                <Button
                                    size="icon"
                                    variant="filledTonal"
                                    className="text-error bg-error-container h-7
                                        w-7"
                                    onClick={() => remove(row.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-end border-t py-3 pr-3 text-sm">
                <span className="text-muted-foreground mr-2">
                    Monatlich gesamt:
                </span>
                <span className="font-medium">
                    {toMonthlyLabel(monthlyTotal, "EUR")}
                </span>
            </div>
        </div>
    );
}
