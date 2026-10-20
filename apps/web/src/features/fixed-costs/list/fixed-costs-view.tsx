import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { AccountMenu } from "#/features/account/account-menu.tsx";
import { FixedCostShareBar } from "#/features/fixed-costs/breakdown/fixed-cost-share-bar.tsx";
import { FixedCostTreemap } from "#/features/fixed-costs/breakdown/fixed-cost-treemap.tsx";
import { useFixedCostCategoryGroups } from "#/features/fixed-costs/fixed-cost-queries.ts";
import { FixedCostCategorySection } from "#/features/fixed-costs/list/fixed-cost-category-section.tsx";
import { FixedCostsHero } from "#/features/fixed-costs/list/fixed-costs-hero.tsx";
import { useIsMediumWindow } from "#/hooks/use-is-medium-window.ts";
import { m } from "#/paraglide/messages.js";
import _ from "lodash";

/**
 * The Fixed costs destination: the running monthly total on top, its
 * breakdown by fixed cost category (a stacked bar on compact windows, a
 * treemap on wider ones), then the fixed costs grouped by fixed cost
 * category, largest first.
 */
export function FixedCostsView() {
    const groups = useFixedCostCategoryGroups();
    const runningGroups = groups.filter((it) => it.share !== null);
    const isMediumWindow = useIsMediumWindow();

    return (
        <div className={"mx-auto flex min-h-dvh w-full max-w-3xl flex-col"}>
            <TopAppBar
                back={false}
                title={m.fixed_costs_title()}
                actions={<AccountMenu className={"medium:hidden"} />}
            />
            <main className={"flex flex-col gap-2 pb-6"}>
                <div className={"flex flex-col gap-4 px-3"}>
                    <FixedCostsHero
                        monthlyTotal={_.sumBy(groups, (it) => it.monthlyAmount)}
                    />
                    {runningGroups.length > 0 &&
                        (isMediumWindow ? (
                            <FixedCostTreemap groups={runningGroups} />
                        ) : (
                            <div className={"px-1"}>
                                <FixedCostShareBar groups={runningGroups} />
                            </div>
                        ))}
                </div>
                {groups.length === 0 ? (
                    <p
                        className={`my-8 text-center text-body-medium
                            text-on-surface-variant`}
                    >
                        {m.fixed_cost_list_empty()}
                    </p>
                ) : (
                    groups.map((group) => (
                        <FixedCostCategorySection
                            key={group.category.id}
                            group={group}
                        />
                    ))
                )}
            </main>
        </div>
    );
}
