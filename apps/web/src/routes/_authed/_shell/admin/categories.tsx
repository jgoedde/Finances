import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { transactionKindSchema } from "@finances/shared";
import { DefaultCategoriesView } from "#/features/admin/default-categories-view.tsx";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/_authed/_shell/admin/categories")({
    head: () => ({
        meta: [
            {
                title: m.page_title({
                    page: m.admin_default_categories_title(),
                }),
            },
        ],
    }),
    validateSearch: z.object({
        kind: transactionKindSchema.optional().catch(undefined),
    }),
    component: RouteComponent,
});

function RouteComponent() {
    const { kind = "expense" } = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });

    return (
        <DefaultCategoriesView
            kind={kind}
            onKindChange={(next) =>
                void navigate({
                    search: (search) => ({ ...search, kind: next }),
                    replace: true,
                })
            }
        />
    );
}
