import { createFileRoute } from "@tanstack/react-router";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { AccountMenu } from "#/features/account/account-menu.tsx";
import { MonthSwitcher } from "#/features/month/month-switcher.tsx";
import { useSelectedMonth } from "#/features/month/month.ts";
import { useMonthOverview } from "#/features/overview/overview-queries.ts";
import { MonthHero } from "#/features/overview/month-hero.tsx";
import { IncomeExpensesCard } from "#/features/overview/income-expenses-card.tsx";
import { CategoryBarsCard } from "#/features/overview/category-bars-card.tsx";
import { TrendCard } from "#/features/overview/trend-card.tsx";
import { PatternsCard } from "#/features/overview/patterns/patterns-card.tsx";
import { ExportSankeyDialog } from "#/features/sankey/export-as-sankey.tsx";
import { NewTransactionFAB } from "#/features/transactions/components/new-transaction-fab.tsx";

export const Route = createFileRoute("/_authed/_shell/")({
    component: RouteComponent,
});

function RouteComponent() {
    const month = useSelectedMonth();
    const overview = useMonthOverview(month);

    return (
        <div className={"flex min-h-dvh flex-col"}>
            <TopAppBar
                back={false}
                className={"pl-1"}
                title={<MonthSwitcher to={"/"} />}
                actions={<AccountMenu className={"medium:hidden"} />}
            />
            {/* Compact and medium: one column in reading order. Expanded:
                hero and categories left, patterns and trend right. */}
            <main
                className={`mx-auto grid w-full max-w-6xl gap-3 px-3 pb-24
                    medium:pb-6 expanded:grid-cols-2 expanded:items-start`}
            >
                {overview && (
                    <>
                        <div className={"flex min-w-0 flex-col gap-3"}>
                            <MonthHero overview={overview} />
                            <IncomeExpensesCard overview={overview} />
                            <CategoryBarsCard overview={overview} />
                        </div>
                        <div className={"flex min-w-0 flex-col gap-3"}>
                            <PatternsCard month={month} />
                            <TrendCard overview={overview} />
                            <div className={"flex justify-center py-2"}>
                                <ExportSankeyDialog />
                            </div>
                        </div>
                    </>
                )}
            </main>
            <NewTransactionFAB variant={"floating"} />
        </div>
    );
}
