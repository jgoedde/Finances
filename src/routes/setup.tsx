import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { useTransactionCount } from "@/components/transactions/use-transactions.ts";
import {
    MAX_BACKUP_INTERVAL_IN_HOURS,
    MIN_BACKUP_INTERVAL_IN_HOURS,
    useBackupConfig,
} from "@/hooks/use-backup-config.ts";
import { Slider } from "@/components/ui/slider.tsx";
import { PersistentDatabase } from "@/persistence/persistent-database.ts";
import { Button } from "@/components/ui/button.tsx";

export const Route = createFileRoute("/setup")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();

    const transactionCount = useTransactionCount();
    const [backupConfig, setBackupConfig] = useBackupConfig();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [importStatus, setImportStatus] = useState<
        | {
              isInitial: true;
          }
        | { isInitial: false; successful: boolean }
    >({ isInitial: true });
    const formRef = useRef<HTMLFormElement | null>(null);

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        void navigate({ to: "/" });
    }

    async function handleImportChangeEvent(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            await PersistentDatabase.importFile(file);
            setImportStatus({ isInitial: false, successful: true });
        } catch (e) {
            console.error("Import failed:", e);
            setImportStatus({ isInitial: false, successful: false });
        }
    }

    return (
        <div className={"bg-scrim/80 flex h-dvh items-center justify-center"}>
            <div className="bg-surface-container-high w-full max-w-sm rounded-2xl p-6 shadow-xl">
                <h2 className="font-poppins mb-6 text-center text-2xl font-semibold">
                    Entschlüsselung
                </h2>

                <div
                    className={
                        "text-on-surface-variant mb-6 flex flex-col gap-y-2 text-sm"
                    }
                >
                    <div>
                        {transactionCount === 0 ? (
                            "Es sind keine Geldbewegungen getrackt. Du kannst eine bestehende Datenbank importieren."
                        ) : (
                            <>
                                In der lokalen Datenbank sind {transactionCount}{" "}
                                Geldbewegungen gespeichert.
                            </>
                        )}
                    </div>
                    <div className={"ml-auto"}>
                        <Button
                            variant={"outline"}
                            onClick={() => {
                                if (!fileInputRef.current) {
                                    return;
                                }

                                fileInputRef.current.click();
                            }}
                        >
                            {!importStatus.isInitial &&
                                importStatus.successful && (
                                    <Check
                                        className={
                                            "text-on-surface-variant size-5"
                                        }
                                    />
                                )}
                            <div>
                                {!importStatus.isInitial &&
                                importStatus.successful
                                    ? "Importiert"
                                    : "Importieren"}
                            </div>
                        </Button>
                        <Input
                            type={"file"}
                            max={1}
                            multiple={false}
                            accept={".db"}
                            className={"hidden"}
                            ref={fileInputRef}
                            onChange={handleImportChangeEvent}
                        />
                    </div>
                </div>

                <form
                    className="space-y-4"
                    onSubmit={handleSubmit}
                    ref={formRef}
                >
                    <div className={"flex flex-col space-y-2"}>
                        <div className={"my-3"}>
                            <div className={"flex flex-col"}>
                                <div className={"text-sm"}>
                                    Automatisches Backup-Interval
                                </div>
                                <div
                                    className={
                                        "text-on-surface-variant text-sm"
                                    }
                                >
                                    {backupConfig.interval === -1 ? (
                                        <>Keine automatischen Backups</>
                                    ) : (
                                        <>
                                            Alle {backupConfig.interval} Stunden
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className={"mt-2"}>
                                <Slider
                                    id={"backup-interval-slider"}
                                    name={"backup-interval"}
                                    min={MIN_BACKUP_INTERVAL_IN_HOURS - 12}
                                    max={MAX_BACKUP_INTERVAL_IN_HOURS}
                                    step={12}
                                    value={[
                                        backupConfig.interval === -1
                                            ? 12
                                            : 60 - backupConfig.interval + 12,
                                    ]}
                                    onValueChange={([v]) => {
                                        // very right = 12, very left = 60
                                        // so we need to invert the value
                                        const int = 60 - v + 12;

                                        if (int === 60) {
                                            setBackupConfig({
                                                ...backupConfig,
                                                interval: -1, //disable
                                            });
                                            return;
                                        }

                                        setBackupConfig({
                                            ...backupConfig,
                                            interval: int,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className={"mt-6 flex w-full justify-center"}>
                        <button
                            type="submit"
                            className="bg-primary text-on-primary flex gap-x-2 rounded-full px-4 py-2 font-medium"
                        >
                            <div>
                                <Check />
                            </div>
                            <div>Loslegen</div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
