import { createFileRoute } from "@tanstack/react-router";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { LanguageCard } from "#/features/settings/language-card.tsx";
import { LocationCard } from "#/features/settings/location-card.tsx";
import { CategoriesCard } from "#/features/settings/categories-card.tsx";
import { ExportCard } from "#/features/settings/export-card.tsx";
import { ImportCard } from "#/features/settings/import-card.tsx";
import { AppVersion } from "#/features/settings/app-version.tsx";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/_authed/_shell/settings/")({
    head: () => ({
        meta: [{ title: m.page_title({ page: m.settings_title() }) }],
    }),
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex min-h-dvh flex-col">
            <TopAppBar title={m.settings_title()} />

            {/*
             * Masonry from `md` on: cards flow into two columns without being
             * split. A child marked `data-full-width` spans both columns.
             */}
            <main
                className={`mx-auto w-full max-w-md gap-4 p-4
                    *:break-inside-avoid *:not-last:mb-4 md:max-w-4xl
                    md:columns-2 [&>[data-full-width]]:[column-span:all]`}
            >
                <LanguageCard />
                <LocationCard />
                <CategoriesCard />
                <ExportCard />
                <ImportCard />
                <AppVersion />
            </main>
        </div>
    );
}
