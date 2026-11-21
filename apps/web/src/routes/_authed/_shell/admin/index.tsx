import { createFileRoute, Link } from "@tanstack/react-router";
import { Shapes } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import { Card } from "#/components/ui/card.tsx";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/_authed/_shell/admin/")({
    head: () => ({
        meta: [{ title: m.page_title({ page: m.admin_title() }) }],
    }),
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex min-h-dvh flex-col">
            <TopAppBar title={m.admin_title()} />
            <main className={"mx-auto w-full max-w-md p-4 md:max-w-4xl"}>
                <Card className={"gap-3 p-4 md:max-w-md"}>
                    <h2 className="font-brand text-title-large">
                        {m.admin_default_categories_title()}
                    </h2>
                    <p className="text-body-medium text-on-surface-variant">
                        {m.admin_default_categories_description()}
                    </p>
                    <Button
                        asChild
                        variant={"filledTonal"}
                        className={"self-start"}
                    >
                        <Link to={"/admin/categories"}>
                            <Shapes />
                            {m.admin_default_categories_open()}
                        </Link>
                    </Button>
                </Card>
            </main>
        </div>
    );
}
