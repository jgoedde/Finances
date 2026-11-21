import { type ChangeEvent, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Upload from "~icons/material-symbols/upload-rounded";
import { toast } from "sonner";
import { Card } from "#/components/ui/card.tsx";
import { Button } from "#/components/ui/button.tsx";
import { confirmAction } from "#/components/confirm-dialog.tsx";
import { ApiError } from "#/api/api-client.ts";
import { importFile } from "#/features/data-transfer/data-transfer-api.ts";
import { importErrorMessage } from "#/features/data-transfer/import-error-message.ts";
import { m } from "#/paraglide/messages.js";

export function ImportCard() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImporting, setIsImporting] = useState(false);

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
        <Card className={"gap-3 p-4"}>
            <h2 className="font-brand text-title-large">{m.action_import()}</h2>
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
                accept={".json,application/json"}
                className={"hidden"}
                onChange={handleFileChange}
            />
        </Card>
    );
}
