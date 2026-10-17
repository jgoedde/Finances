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
import { Link } from "@tanstack/react-router";
import {
    type FixedCost,
    toIsoDate,
} from "@/features/fixed-costs/fixed-cost.ts";
import {
    useCreateFixedCost,
    useDeleteFixedCost,
    useFixedCosts,
    useMonthlyFixedCostTotal,
    useUpdateFixedCost,
} from "@/features/fixed-costs/fixed-cost-queries.ts";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch.tsx";
import { Card } from "@/components/ui/card.tsx";
import { useIsOnline } from "@/features/sync/connectivity.ts";
import { OfflineHint } from "@/features/sync/offline-hint.tsx";

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
    const fixedCosts = useFixedCosts();
    const monthlyTotal = useMonthlyFixedCostTotal();
    const createFixedCost = useCreateFixedCost();
    const updateFixedCost = useUpdateFixedCost();
    const deleteFixedCost = useDeleteFixedCost();
    // Fixed costs are read-only offline.
    const isOnline = useIsOnline();

    async function toggleActive(row: FixedCost) {
        try {
            await updateFixedCost.mutateAsync({
                id: row.id,
                patch: { active: !row.active },
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

    async function remove(id: string) {
        if (!confirm("Möchtest Du diese Fixkostenstelle wirklich löschen?")) {
            return;
        }

        try {
            await deleteFixedCost.mutateAsync(id);
            toast.success("Die Fixkostenstelle wurde gelöscht");
        } catch {
            toast.error(
                "Die Fixkostenstelle konnte nicht gelöscht werden. Bitte versuche es erneut",
            );
        }
    }

    return (
        <Card className={"m-2 gap-4 px-2 py-4"}>
            <div className={"flex flex-wrap items-center gap-2 px-2"}>
                <h2 className={"font-brand text-title-large grow"}>
                    Fixkosten
                </h2>
                <OfflineHint active={!isOnline}>
                    <Button
                        variant={"filledTonal"}
                        disabled={!isOnline}
                        onClick={async () => {
                            await createFixedCost.mutateAsync({
                                active: true,
                                amount: 0,
                                startDate: toIsoDate(new Date()),
                                categoryId: "1",
                                currency: "EUR",
                                endDate: null,
                                name: "Leer",
                                description: null,
                                interval: "monthly",
                            });
                        }}
                    >
                        <Plus />
                        Fixkosten erfassen
                    </Button>
                </OfflineHint>
            </div>
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
                                !row.isRunning ? "opacity-38" : undefined
                            }
                        >
                            <TableCell className="text-body-large">
                                <Link
                                    className={`text-on-surface focus-ring
                                    inline-flex items-center gap-x-1 rounded-xs
                                    underline-offset-4 hover:underline`}
                                    to={`/fixed-costs/$id`}
                                    params={{ id: row.id }}
                                >
                                    {row.name}{" "}
                                    <ChevronRight
                                        className={
                                            "text-on-surface-variant size-4"
                                        }
                                    />
                                </Link>
                            </TableCell>
                            <TableCell>
                                <span className="text-on-surface-variant">
                                    {row.category.name}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                {toMonthlyLabel(row.amount, row.currency)}
                            </TableCell>
                            <TableCell>
                                <span className="text-on-surface-variant">
                                    {INTERVAL_LABELS[row.interval]}
                                </span>
                            </TableCell>
                            <TableCell
                                className="text-on-surface-variant text-right"
                            >
                                {toMonthlyLabel(
                                    row.monthlyAmount,
                                    row.currency,
                                )}
                            </TableCell>
                            <TableCell>
                                <OfflineHint active={!isOnline}>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            aria-label={"Aktiv"}
                                            checked={row.active}
                                            disabled={!isOnline}
                                            onCheckedChange={() =>
                                                toggleActive(row)
                                            }
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            aria-label={"Löschen"}
                                            disabled={!isOnline}
                                            onClick={() => remove(row.id)}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </OfflineHint>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div
                className={`border-outline-variant text-body-medium flex
                    justify-end border-t px-4 pt-4`}
            >
                <span className="text-on-surface-variant mr-2">
                    Monatlich gesamt:
                </span>
                <span className="text-title-small">
                    {toMonthlyLabel(monthlyTotal, "EUR")}
                </span>
            </div>
        </Card>
    );
}
