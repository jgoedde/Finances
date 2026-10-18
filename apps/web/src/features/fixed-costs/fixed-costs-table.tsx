import { formatCurrency } from "@finances/shared";
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
import {
    type FixedCost,
    INTERVAL_LABELS,
} from "#/features/fixed-costs/fixed-cost.ts";
import {
    useDeleteFixedCost,
    useFixedCosts,
    useUpdateFixedCost,
} from "#/features/fixed-costs/fixed-cost-queries.ts";
import { Switch } from "#/components/ui/switch.tsx";
import { Card } from "#/components/ui/card.tsx";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

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
        if (confirm(m.fixed_cost_delete_confirm())) {
            deleteFixedCost.mutate(id);
        }
    }

    return (
        <Card className={"m-2 gap-4 px-2 py-4"}>
            <div className={"flex flex-wrap items-center gap-2 px-2"}>
                <h2 className={"grow font-brand text-title-large"}>
                    {m.fixed_costs_title()}
                </h2>
                <OfflineHint active={!isOnline}>
                    {isOnline ? (
                        <Button variant={"filledTonal"} asChild>
                            <Link to={"/fixed-costs/new"}>
                                <Plus />
                                {m.fixed_cost_add()}
                            </Link>
                        </Button>
                    ) : (
                        <Button variant={"filledTonal"} disabled>
                            <Plus />
                            {m.fixed_cost_add()}
                        </Button>
                    )}
                </OfflineHint>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{m.fixed_cost_name()}</TableHead>
                        <TableHead>{m.fixed_cost_category()}</TableHead>
                        <TableHead className="text-right">
                            {m.fixed_cost_amount()}
                        </TableHead>
                        <TableHead>{m.fixed_cost_interval()}</TableHead>
                        <TableHead className="text-right">
                            {m.fixed_cost_per_month()}
                        </TableHead>
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
                                {formatCurrency(
                                    row.amount,
                                    getLocale(),
                                    row.currency,
                                )}
                            </TableCell>
                            <TableCell>
                                <span className="text-on-surface-variant">
                                    {INTERVAL_LABELS[row.interval]()}
                                </span>
                            </TableCell>
                            <TableCell
                                className="text-right text-on-surface-variant"
                            >
                                {formatCurrency(
                                    row.monthlyAmount,
                                    getLocale(),
                                    row.currency,
                                )}
                            </TableCell>
                            <TableCell>
                                <OfflineHint active={!isOnline}>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            aria-label={m.fixed_cost_active()}
                                            checked={row.active}
                                            disabled={!isOnline}
                                            onCheckedChange={() =>
                                                toggleActive(row)
                                            }
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            aria-label={m.action_delete()}
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
                    {m.fixed_cost_monthly_total()}
                </span>
                <span className="text-title-small">
                    {formatCurrency(monthlyTotal, getLocale())}
                </span>
            </div>
        </Card>
    );
}
