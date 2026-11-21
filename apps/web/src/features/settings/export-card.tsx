import { useState } from "react";
import Download from "~icons/material-symbols/download-rounded";
import { toast } from "sonner";
import { Card } from "#/components/ui/card.tsx";
import { Button } from "#/components/ui/button.tsx";
import { downloadExport } from "#/features/data-transfer/data-transfer-api.ts";
import { m } from "#/paraglide/messages.js";

export function ExportCard() {
    const [isExporting, setIsExporting] = useState(false);

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

    return (
        <Card className={"gap-3 p-4"}>
            <h2 className="font-brand text-title-large">{m.action_export()}</h2>
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
    );
}
