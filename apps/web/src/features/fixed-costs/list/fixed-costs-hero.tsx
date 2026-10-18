import { formatCurrency } from "@finances/shared";
import { sumBy } from "lodash";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import { Card } from "#/components/ui/card.tsx";
import type { FixedCost } from "#/features/fixed-costs/fixed-cost.ts";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface FixedCostsHeroProps {
    fixedCosts: FixedCost[];
}

/**
 * The monthly total of the running fixed costs, with the add button.
 * Fixed costs are read-only offline.
 */
export function FixedCostsHero({ fixedCosts }: FixedCostsHeroProps) {
    const monthlyTotal = sumBy(
        fixedCosts.filter((it) => it.isRunning),
        (it) => it.monthlyAmount,
    );
    const isOnline = useIsOnline();

    return (
        <Card className={"flex-row flex-wrap items-end gap-4 p-5"}>
            <div className={"flex grow flex-col gap-1"}>
                <span className={"text-label-large text-on-surface-variant"}>
                    {m.fixed_cost_monthly_total()}
                </span>
                <span
                    className={"font-brand text-display-medium text-on-surface"}
                >
                    {formatCurrency(monthlyTotal, getLocale())}
                </span>
            </div>
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
        </Card>
    );
}
