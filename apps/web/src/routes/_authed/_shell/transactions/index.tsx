import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { Button } from "#/components/ui/button.tsx";
import { AccountMenu } from "#/features/account/account-menu.tsx";
import { MonthSwitcher } from "#/features/month/month-switcher.tsx";
import { TransactionList } from "#/features/transactions/components/list/transaction-list.tsx";
import { NewTransactionFAB } from "#/features/transactions/components/new-transaction-fab.tsx";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/_authed/_shell/transactions/")({
    head: () => ({
        meta: [{ title: m.page_title({ page: m.nav_transactions() }) }],
    }),
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className={"flex min-h-dvh flex-col"}>
            <TopAppBar
                back={false}
                className={"pl-1"}
                title={<MonthSwitcher />}
                actions={
                    <>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            aria-label={m.search_label()}
                            asChild
                        >
                            <Link to={"/transactions/search"}>
                                <Search />
                            </Link>
                        </Button>
                        <AccountMenu className={"medium:hidden"} />
                    </>
                }
            />
            <main className={"mx-auto w-full max-w-3xl"}>
                <TransactionList />
            </main>
            <NewTransactionFAB variant={"floating"} />
        </div>
    );
}
