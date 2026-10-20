import { formatCurrency, formatPercent } from "@finances/shared";
import { Link, useParams } from "@tanstack/react-router";
import { Switch } from "#/components/ui/switch.tsx";
import {
    type FixedCost,
    INTERVAL_LABELS,
} from "#/features/fixed-costs/fixed-cost.ts";
import { useUpdateFixedCost } from "#/features/fixed-costs/fixed-cost-queries.ts";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface FixedCostListItemProps {
    fixedCost: FixedCost;

    /**
     * Share of the monthly total; `null` while not running.
     */
    share: number | null;
}

/**
 * One fixed cost: name, interval (and the amount per interval unless
 * monthly), share, the monthly amount and the active switch. Opens the
 * edit view; dimmed while not running.
 */
export function FixedCostListItem({
    fixedCost,
    share,
}: FixedCostListItemProps) {
    const updateFixedCost = useUpdateFixedCost();
    // Fixed costs are read-only offline.
    const isOnline = useIsOnline();
    // Open in the detail pane beside the list.
    const isSelected =
        useParams({
            from: "/_authed/_shell/fixed-costs/$id",
            shouldThrow: false,
        })?.id === fixedCost.id;

    const supportingText = [
        INTERVAL_LABELS[fixedCost.interval](),
        fixedCost.interval !== "monthly" &&
            formatCurrency(fixedCost.amount, getLocale(), fixedCost.currency),
        share !== null && formatPercent(share, getLocale()),
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <div
            className={cn(
                "flex items-center gap-2 rounded-md pr-3",
                isSelected && "bg-secondary-container",
            )}
        >
            <Link
                to={"/fixed-costs/$id"}
                params={{ id: fixedCost.id }}
                aria-current={isSelected || undefined}
                className={cn(
                    `state-layer flex min-h-14 min-w-0 grow items-center gap-x-4
                    rounded-md px-3 py-2 focus-ring`,
                    !fixedCost.isRunning && "opacity-38",
                )}
            >
                <div className={"flex min-w-0 flex-1 flex-col"}>
                    <span
                        title={fixedCost.name}
                        className={"truncate text-body-large text-on-surface"}
                    >
                        {fixedCost.name}
                    </span>
                    <span
                        className={
                            "truncate text-body-medium text-on-surface-variant"
                        }
                    >
                        {supportingText}
                    </span>
                </div>
                <div className={"flex shrink-0 flex-col items-end"}>
                    <span className={"text-label-large text-on-surface"}>
                        {formatCurrency(
                            fixedCost.monthlyAmount,
                            getLocale(),
                            fixedCost.currency,
                        )}
                    </span>
                    <span
                        className={"text-label-small text-on-surface-variant"}
                    >
                        {m.fixed_cost_per_month()}
                    </span>
                </div>
            </Link>
            <OfflineHint active={!isOnline}>
                <Switch
                    aria-label={m.fixed_cost_active()}
                    checked={fixedCost.active}
                    disabled={!isOnline}
                    // Optimistic: the hook updates the list and rolls back with a toast.
                    onCheckedChange={() =>
                        updateFixedCost.mutate({
                            id: fixedCost.id,
                            patch: { active: !fixedCost.active },
                        })
                    }
                />
            </OfflineHint>
        </div>
    );
}
