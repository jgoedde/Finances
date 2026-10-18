import type { FixedCostInterval } from "@finances/shared";
import { groupBy } from "lodash";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { AccountMenu } from "#/features/account/account-menu.tsx";
import { INTERVAL_LABELS } from "#/features/fixed-costs/fixed-cost.ts";
import { useFixedCosts } from "#/features/fixed-costs/fixed-cost-queries.ts";
import { FixedCostGroup } from "#/features/fixed-costs/list/fixed-cost-group.tsx";
import { FixedCostsHero } from "#/features/fixed-costs/list/fixed-costs-hero.tsx";
import { m } from "#/paraglide/messages.js";

const INTERVALS = Object.keys(INTERVAL_LABELS) as FixedCostInterval[];

/**
 * The Fixed costs destination: the running monthly total on top, then the
 * fixed costs grouped by interval.
 */
export function FixedCostsView() {
    const fixedCosts = useFixedCosts();
    const byInterval = groupBy(fixedCosts, (it) => it.interval);

    return (
        <div className={"mx-auto flex min-h-dvh w-full max-w-3xl flex-col"}>
            <TopAppBar
                back={false}
                title={m.fixed_costs_title()}
                actions={<AccountMenu className={"medium:hidden"} />}
            />
            <main className={"flex flex-col gap-2 pb-6"}>
                <div className={"px-3"}>
                    <FixedCostsHero fixedCosts={fixedCosts} />
                </div>
                {fixedCosts.length === 0 ? (
                    <p
                        className={`my-8 text-center text-body-medium
                            text-on-surface-variant`}
                    >
                        {m.fixed_cost_list_empty()}
                    </p>
                ) : (
                    INTERVALS.map((interval) => {
                        const group = byInterval[interval];
                        return (
                            group && (
                                <FixedCostGroup
                                    key={interval}
                                    interval={interval}
                                    fixedCosts={group}
                                />
                            )
                        );
                    })
                )}
            </main>
        </div>
    );
}
