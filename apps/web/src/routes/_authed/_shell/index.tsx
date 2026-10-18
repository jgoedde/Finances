import { createFileRoute } from "@tanstack/react-router";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { AccountMenu } from "#/features/account/account-menu.tsx";
import { LazyRow } from "#/features/transactions/components/lazy-row.tsx";
import { MonthlyOverview } from "#/features/transactions/components/charts/monthly-overview.tsx";
import { NewTransactionFAB } from "#/features/transactions/components/new-transaction-fab.tsx";
import { Insights } from "#/features/transactions/components/insights.tsx";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/_authed/_shell/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className={"flex min-h-dvh flex-col"}>
            <TopAppBar
                back={false}
                title={m.nav_overview()}
                actions={<AccountMenu className={"medium:hidden"} />}
            />
            <main className={"mx-auto w-full max-w-5xl"}>
                <LazyRow />
                <MonthlyOverview />
                <Insights />
            </main>
            <NewTransactionFAB variant={"floating"} />
        </div>
    );
}
