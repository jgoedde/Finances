import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "#/components/ui/table.tsx";
import { Button } from "#/components/ui/button.tsx";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { FixedCost } from "#/features/fixed-costs/fixed-cost.ts";
import {
    useDeleteFixedCost,
    useFixedCosts,
    useUpdateFixedCost,
} from "#/features/fixed-costs/fixed-cost-queries.ts";
import { Switch } from "#/components/ui/switch.tsx";
import { Card } from "#/components/ui/card.tsx";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";

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
    const monthlyTotal = fixedCosts
        .filter((fixedCost) => fixedCost.isRunning)
        .reduce((total, fixedCost) => total + fixedCost.monthlyAmount, 0);
    const updateFixedCost = useUpdateFixedCost();
    const deleteFixedCost = useDeleteFixedCost();
    // Fixed costs are read-only offline.
    const isOnline = useIsOnline();

    // Optimistic: the hooks update the list and roll back with a toast.
    function toggleActive(row: FixedCost) {
        updateFixedCost.mutate({ id: row.id, patch: { active: !row.active } });
    }

    function remove(id: string) {
        if (confirm("Möchtest Du diese Fixkostenstelle wirklich löschen?")) {
            deleteFixedCost.mutate(id);
        }
    }

    return (
        <Card className={"m-2 gap-4 px-2 py-4"}>
            <div className={"flex flex-wrap items-center gap-2 px-2"}>
                <h2 className={"grow font-brand text-title-large"}>
                    Fixkosten
                </h2>
                <OfflineHint active={!isOnline}>
                    {isOnline ? (
                        <Button variant={"filledTonal"} asChild>
                            <Link to={"/fixed-costs/new"}>
                                <Plus />
                                Fixkosten erfassen
                            </Link>
                        </Button>
                    ) : (
                        <Button variant={"filledTonal"} disabled>
                            <Plus />
                            Fixkosten erfassen
                        </Button>
                    )}
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
                                    className={`inline-flex items-center gap-x-1
                                    rounded-xs text-on-surface
                                    underline-offset-4 focus-ring
                                    hover:underline`}
                                    to={`/fixed-costs/$id`}
                                    params={{ id: row.id }}
                                >
                                    {row.name}{" "}
                                    <ChevronRight
                                        className={
                                            "size-4 text-on-surface-variant"
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
                                className="text-right text-on-surface-variant"
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
                className={`flex justify-end border-t border-outline-variant
                    px-4 pt-4 text-body-medium`}
            >
                <span className="mr-2 text-on-surface-variant">
                    Monatlich gesamt:
                </span>
                <span className="text-title-small">
                    {toMonthlyLabel(monthlyTotal, "EUR")}
                </span>
            </div>
        </Card>
    );
}
