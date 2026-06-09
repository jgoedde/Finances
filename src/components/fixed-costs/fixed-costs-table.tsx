// src/components/fixed-costs/FixedCostsTable.tsx
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { fixedCostRepository } from "@/persistence/repositories/fixed-costs-repository";
import type { FixedCost } from "@/persistence/types";
import type { FixedCostPayload } from "@/persistence/row-mapper";
import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch.tsx";
import { useCategories } from "@/components/transactions/use-categories.ts";

type EditState = Partial<FixedCostPayload> & { id: number };

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

    const categories = useCategories();

    const [editing, setEditing] = useState<EditState>();

    function startEdit(row: FixedCost) {
        setEditing({
            id: row.id,
            name: row.name,
            description: row.description ?? null,
            amount: row.amount,
            currency: row.currency,
            interval: row.interval,
            category_id: row.category.id,
            active: row.active ? 1 : 0,
            start_date: row.startDate.toISOString().split("T")[0],
            end_date: row.endDate
                ? row.endDate.toISOString().split("T")[0]
                : null,
        });
    }

    function cancelEdit() {
        setEditing(undefined);
    }

    async function saveEdit() {
        if (!editing) {
            return;
        }

        const { id, ...patch } = editing;

        try {
            await fixedCostRepository.update(id, patch);
            toast.success("Die Fixkostenstelle wurde erfolgreich gespeichert.");
        } catch {
            toast.error(
                "Die Fixkostenstelle konnte nicht gespeichert werden. Bitte versuche es erneut.",
            );
        } finally {
            setEditing(undefined);
        }
    }

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
        try {
            await fixedCostRepository.remove(id);
            toast.success("Die Fixkostenstelle wurde gelöscht");
        } catch {
            toast.error(
                "Die Fixkostenstelle konnte nicht gelöscht werden. Bitte versuche es erneut",
            );
        }
    }

    function patchEdit(field: keyof FixedCostPayload, value: unknown) {
        setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));
    }

    const monthlyTotal = fixedCostRepository.monthlyTotal();

    return (
        <div className="space-y-4">
            <Button
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
                    {fixedCosts.map((row) =>
                        editing?.id === row.id ? (
                            <TableRow key={row.id} className="bg-muted/40">
                                <TableCell>
                                    <Input
                                        value={editing.name ?? ""}
                                        onChange={(e) =>
                                            patchEdit("name", e.target.value)
                                        }
                                        className="h-8"
                                        autoFocus
                                    />
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={
                                            editing.category_id === undefined
                                                ? ""
                                                : String(editing.category_id)
                                        }
                                        onValueChange={(v) =>
                                            patchEdit("category_id", v)
                                        }
                                    >
                                        <SelectTrigger className="h-8 w-36">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Intervalle
                                                </SelectLabel>
                                                {categories.map((it) => (
                                                    <SelectItem
                                                        key={it.id}
                                                        value={String(it.id)}
                                                    >
                                                        {it.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        min={0}
                                        step={0.01}
                                        value={editing.amount ?? ""}
                                        onChange={(e) =>
                                            patchEdit(
                                                "amount",
                                                parseFloat(e.target.value),
                                            )
                                        }
                                        className="h-8 text-right"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={editing.interval}
                                        onValueChange={(v) =>
                                            patchEdit("interval", v)
                                        }
                                    >
                                        <SelectTrigger className="h-8 w-36">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Intervalle
                                                </SelectLabel>
                                                {Object.entries(
                                                    INTERVAL_LABELS,
                                                ).map(([k, v]) => (
                                                    <SelectItem
                                                        key={k}
                                                        value={k}
                                                    >
                                                        {v}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-right text-sm">
                                    {editing.amount && editing.interval
                                        ? toMonthlyLabel(
                                              editing.amount /
                                                  {
                                                      monthly: 1,
                                                      quarterly: 3,
                                                      yearly: 12,
                                                  }[editing.interval],
                                              editing.currency ?? "EUR",
                                          )
                                        : "–"}
                                </TableCell>
                                <TableCell className="flex items-center gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-green-600"
                                        onClick={saveEdit}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-destructive h-7 w-7"
                                        onClick={cancelEdit}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow
                                key={row.id}
                                className={
                                    !row.isRunning ? "opacity-50" : undefined
                                }
                            >
                                <TableCell className="font-medium">
                                    {row.name}
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
                                <TableCell className="text-muted-foreground text-right text-sm">
                                    {toMonthlyLabel(
                                        row.monthlyAmount,
                                        row.currency,
                                    )}
                                </TableCell>
                                <TableCell className="flex items-center gap-1">
                                    <Switch
                                        checked={row.active}
                                        onCheckedChange={() =>
                                            toggleActive(row)
                                        }
                                    />
                                    <Button
                                        size="icon"
                                        variant="filledTonal"
                                        className="h-7 w-7"
                                        onClick={() => startEdit(row)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="filledTonal"
                                        className="text-error bg-error-container h-7 w-7"
                                        onClick={() => remove(row.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ),
                    )}
                </TableBody>
            </Table>

            <div className="flex justify-end border-t pt-3 text-sm">
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
