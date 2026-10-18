import { createFileRoute } from "@tanstack/react-router";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { AccountMenu } from "#/features/account/account-menu.tsx";
import { FixedCostsTable } from "#/features/fixed-costs/fixed-costs-table.tsx";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/_authed/_shell/fixed-costs/")({
    head: () => ({
        meta: [{ title: m.page_title({ page: m.fixed_costs_title() }) }],
    }),
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className={"flex min-h-dvh flex-col"}>
            <TopAppBar
                back={false}
                title={m.fixed_costs_title()}
                actions={<AccountMenu className={"medium:hidden"} />}
            />
            <main className={"mx-auto w-full max-w-5xl"}>
                <FixedCostsTable />
            </main>
        </div>
    );
}
