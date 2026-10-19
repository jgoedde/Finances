import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { Card } from "#/components/ui/card.tsx";
import { Button } from "#/components/ui/button.tsx";
import { SegmentedButton } from "#/components/ui/segmented-button.tsx";
import { Switch } from "#/components/ui/switch.tsx";
import { confirmAction } from "#/components/confirm-dialog.tsx";
import { ApiError } from "#/api/api-client.ts";
import { apiErrorCode, apiErrorMessage } from "#/api/api-errors.ts";
import {
    downloadExport,
    importFile,
} from "#/features/data-transfer/data-transfer-api.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale, type Locale, locales } from "#/paraglide/runtime.js";
import { chooseLocale } from "#/i18n.ts";
import { useSaveLocation } from "#/features/transactions/device-location.ts";

export const Route = createFileRoute("/_authed/_shell/settings")({
    head: () => ({
        meta: [{ title: m.page_title({ page: m.settings_title() }) }],
    }),
    component: RouteComponent,
});

/**
 * Each language in its own words.
 */
const LANGUAGE_NAMES = {
    de: "Deutsch",
    en: "English",
} as const satisfies Record<Locale, string>;

/**
 * Where validation failed, e.g. "transactions.12.date: …", if reported.
 */
function firstIssue(body: unknown): string | undefined {
    const issues = (body as { issues?: { path: unknown[]; message: string }[] })
        ?.issues;
    const issue = issues?.[0];
    return issue && `${issue.path.join(".")}: ${issue.message}`;
}

function importErrorMessage(error: unknown): string {
    const code = apiErrorCode(error);
    const issue =
        error instanceof ApiError && code === "invalid_file"
            ? firstIssue(error.body)
            : undefined;
    if (issue) {
        return m.settings_import_invalid_file_detail({ issue });
    }
    // The file references a category it doesn't contain.
    if (code === "unknown_category") {
        return m.api_error_invalid_file();
    }
    return apiErrorMessage(code) ?? m.settings_import_failed();
}

function RouteComponent() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [savesLocation, setSavesLocation] = useSaveLocation();
    const [isLocationDenied, setIsLocationDenied] = useState(false);

    async function handleSaveLocationChange(enabled: boolean) {
        setIsLocationDenied(!(await setSavesLocation(enabled)));
    }

    async function handleExport() {
        setIsExporting(true);
        try {
            await downloadExport();
        } catch {
            toast.error(m.settings_export_failed());
        } finally {
            setIsExporting(false);
        }
    }

    /**
     * Imports the file; resolves to `false` if it can only be imported by
     * replacing the existing data.
     */
    async function runImport(file: File, replace: boolean): Promise<boolean> {
        setIsImporting(true);
        try {
            const result = await importFile(file, { replace });
            await queryClient.invalidateQueries();
            toast.success(
                m.settings_import_success({
                    transactions: result.transactions,
                    fixedCosts: result.fixedCosts,
                }),
            );
        } catch (error) {
            if (!replace && error instanceof ApiError && error.status === 409) {
                return false;
            }
            toast.error(importErrorMessage(error));
        } finally {
            setIsImporting(false);
        }
        return true;
    }

    async function importOrReplace(file: File) {
        if (
            !(await runImport(file, false)) &&
            (await confirmAction({
                title: m.settings_import_replace_title(),
                description: m.settings_import_replace_description(),
                confirmLabel: m.action_replace(),
                destructive: true,
            }))
        ) {
            await runImport(file, true);
        }
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (file) {
            void importOrReplace(file);
        }
    }

    return (
        <div className="flex min-h-dvh flex-col">
            <TopAppBar title={m.settings_title()} />

            <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
                <Card className={"gap-3 p-4"}>
                    <h2 className="font-brand text-title-large">
                        {m.settings_language()}
                    </h2>
                    <p className="text-body-medium text-on-surface-variant">
                        {m.settings_language_description()}
                    </p>
                    <SegmentedButton
                        options={locales.map((locale) => ({
                            label: LANGUAGE_NAMES[locale],
                            value: locale,
                        }))}
                        value={getLocale()}
                        onChange={(locale) => chooseLocale(locale as Locale)}
                    />
                </Card>

                <Card className={"gap-3 p-4"}>
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="font-brand text-title-large">
                            <label htmlFor={"save-location"}>
                                {m.settings_location()}
                            </label>
                        </h2>
                        <Switch
                            id={"save-location"}
                            checked={savesLocation}
                            onCheckedChange={(enabled) =>
                                void handleSaveLocationChange(enabled)
                            }
                        />
                    </div>
                    <p className="text-body-medium text-on-surface-variant">
                        {m.settings_location_description()}
                    </p>
                    {isLocationDenied && (
                        <p
                            role={"alert"}
                            className="text-body-medium text-error"
                        >
                            {m.settings_location_denied()}
                        </p>
                    )}
                </Card>

                <Card className={"gap-3 p-4"}>
                    <h2 className="font-brand text-title-large">
                        {m.action_export()}
                    </h2>
                    <p className="text-body-medium text-on-surface-variant">
                        {m.settings_export_description()}
                    </p>
                    <Button
                        variant={"filledTonal"}
                        className={"self-start"}
                        disabled={isExporting}
                        onClick={() => void handleExport()}
                    >
                        <Download />
                        {m.action_export()}
                    </Button>
                </Card>

                <Card className={"gap-3 p-4"}>
                    <h2 className="font-brand text-title-large">
                        {m.action_import()}
                    </h2>
                    <p className="text-body-medium text-on-surface-variant">
                        {m.settings_import_description()}
                    </p>
                    <Button
                        variant={"filledTonal"}
                        className={"self-start"}
                        disabled={isImporting}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload />
                        {m.action_import()}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type={"file"}
                        accept={".json,.db,application/json"}
                        className={"hidden"}
                        onChange={handleFileChange}
                    />
                </Card>

                <p
                    className={`py-4 text-center text-body-small
                        text-on-surface-variant`}
                >
                    {m.app_name()}{" "}
                    <a
                        className={
                            "text-primary underline-offset-4 hover:underline"
                        }
                        href="https://github.com/jgoedde/Finances/releases"
                    >
                        v{__APP_VERSION__}
                    </a>{" "}
                    · {import.meta.env.MODE}
                </p>
            </main>
        </div>
    );
}
