import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { TopAppBar } from "@/components/ui/top-app-bar.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { ApiError } from "@/api/api-client.ts";
import {
    downloadExport,
    importFile,
} from "@/features/data-transfer/data-transfer-api.ts";

export const Route = createFileRoute("/_authed/settings")({
    component: RouteComponent,
});

/** Where validation failed, e.g. "transactions.12.date: …", if reported. */
function firstIssue(body: unknown): string | undefined {
    const issues = (body as { issues?: { path: unknown[]; message: string }[] })
        ?.issues;
    const issue = issues?.[0];
    return issue && `${issue.path.join(".")}: ${issue.message}`;
}

function importErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        switch (error.status) {
            case 413:
                return "Die Datei ist zu groß.";
            case 422: {
                const issue = firstIssue(error.body);
                return issue
                    ? `Die Datei ist kein gültiges Backup (${issue}).`
                    : "Die Datei ist kein gültiges Backup.";
            }
        }
    }
    return "Der Import ist fehlgeschlagen. Bitte versuche es erneut.";
}

function RouteComponent() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    // A file that can only be imported by replacing the existing data.
    const [fileToReplaceWith, setFileToReplaceWith] = useState<File | null>(
        null,
    );

    async function handleExport() {
        setIsExporting(true);
        try {
            await downloadExport();
        } catch {
            toast.error("Der Export ist fehlgeschlagen.");
        } finally {
            setIsExporting(false);
        }
    }

    async function runImport(file: File, replace: boolean) {
        setIsImporting(true);
        try {
            const result = await importFile(file, { replace });
            await queryClient.invalidateQueries();
            toast.success(
                `${result.transactions} Geldbewegungen und ${result.fixedCosts} Fixkosten importiert.`,
            );
        } catch (error) {
            if (!replace && error instanceof ApiError && error.status === 409) {
                setFileToReplaceWith(file);
                return;
            }
            toast.error(importErrorMessage(error));
        } finally {
            setIsImporting(false);
        }
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (file) {
            void runImport(file, false);
        }
    }

    return (
        <div className="flex min-h-dvh flex-col">
            <TopAppBar title={"Einstellungen"} />

            <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
                <Card className={"gap-3 p-4"}>
                    <h2 className="font-brand text-title-large">Exportieren</h2>
                    <p className="text-on-surface-variant text-body-medium">
                        Lade alle Deine Geldbewegungen, Kategorien und Fixkosten
                        als Datei herunter. Du kannst sie später in ein neues
                        Konto importieren.
                    </p>
                    <Button
                        variant={"filledTonal"}
                        className={"self-start"}
                        disabled={isExporting}
                        onClick={() => void handleExport()}
                    >
                        <Download />
                        Exportieren
                    </Button>
                </Card>

                <Card className={"gap-3 p-4"}>
                    <h2 className="font-brand text-title-large">Importieren</h2>
                    <p className="text-on-surface-variant text-body-medium">
                        Übernimm einen Export oder ein Backup der alten App
                        (.db). Deine Kategorien werden dabei ersetzt. Enthält
                        Dein Konto schon Geldbewegungen oder Fixkosten, kannst
                        Du alles durch die Datei ersetzen.
                    </p>
                    <Button
                        variant={"filledTonal"}
                        className={"self-start"}
                        disabled={isImporting}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload />
                        Importieren
                    </Button>
                    <input
                        ref={fileInputRef}
                        type={"file"}
                        accept={".json,.db,application/json"}
                        className={"hidden"}
                        onChange={handleFileChange}
                    />
                </Card>

                <AlertDialog
                    open={fileToReplaceWith !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            setFileToReplaceWith(null);
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Alle Daten ersetzen?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Dein Konto enthält bereits Daten. Der Import
                                löscht alle Geldbewegungen, Fixkosten und
                                Kategorien und ersetzt sie durch die aus der
                                Datei. Das kann nicht rückgängig gemacht werden;
                                exportiere vorher, wenn Du die aktuellen Daten
                                behalten willst.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (fileToReplaceWith) {
                                        void runImport(fileToReplaceWith, true);
                                    }
                                }}
                            >
                                Ersetzen
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </main>
        </div>
    );
}
