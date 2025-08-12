import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { Check, KeyRound, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { useEncryption } from "@/components/use-encryption.ts";
import {
    useExpensesCount,
    useMasterPasswordCheck,
} from "@/components/expenses/use-expenses.ts";

export const Route = createFileRoute("/setup")({
    component: RouteComponent,
});

export interface GitHubConfig {
    gistName: string;
    pat?: string;
    gistId?: string;
}

function RouteComponent() {
    const navigate = useNavigate();

    const { key, setKey } = useEncryption();
    const expensesCount = useExpensesCount();
    const check = useMasterPasswordCheck();

    const [canDecrypt, setCanDecrypt] = useState<
        { isInitial: true } | { isInitial: false; canDecrypt: boolean }
    >({ isInitial: true });

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!key) {
            return;
        }

        const isValid = check(key);
        setCanDecrypt({ isInitial: false, canDecrypt: isValid });

        if (isValid) {
            void navigate({ to: "/" });
        }
    }

    return (
        <div className={"flex h-dvh items-center justify-center"}>
            <div className="bg-surface-container-highest w-full max-w-sm rounded-2xl p-6 shadow-xl">
                <h2 className="font-poppins mb-6 text-center text-2xl font-semibold">
                    Entschlüsselung
                </h2>

                <div
                    className={
                        "text-on-surface-variant mb-6 flex flex-col gap-y-2 text-sm"
                    }
                >
                    <div>
                        In der lokalen Datenbank sind {expensesCount}{" "}
                        Geldbewegungen gespeichert.
                    </div>
                    <div className={"ml-auto"}>
                        <Link
                            className={
                                "text-primary decoration-primary hover:underline"
                            }
                            to={"/blob"}
                        >
                            Importieren
                        </Link>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className={"flex gap-x-4"}>
                        <div className={"text-secondary w-8"}>
                            <KeyRound className={"w-full"} />
                        </div>
                        <div className={"w-full"}>
                            <label htmlFor="master" className="block text-sm">
                                Master Passwort
                            </label>
                            <Input
                                name={"master"}
                                id={"master"}
                                value={key ?? ""}
                                type={"password"}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder={"<super sicheres Passwort>"}
                                className={
                                    "border-outline mt-1 block w-full rounded-xs border px-4 py-2 text-sm shadow-sm"
                                }
                                autoComplete={"current-password"}
                                required
                            />
                        </div>
                    </div>

                    {!canDecrypt.isInitial && !canDecrypt.canDecrypt && (
                        <div
                            className={
                                "bg-error text-on-error flex items-center gap-x-4 rounded-md p-3 text-sm"
                            }
                        >
                            <div>
                                <TriangleAlert />
                            </div>
                            <div>
                                <div className={"font-semibold"}>
                                    Das Master Passwort ist falsch.
                                </div>
                                <div>
                                    Bitte überprüfe dein Passwort und versuche
                                    es erneut.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className={"mt-6 flex w-full justify-center"}>
                        <button
                            type="submit"
                            className="bg-primary-container text-on-primary-container flex gap-x-2 rounded-full px-4 py-2 font-medium"
                        >
                            <div>
                                <Check />
                            </div>
                            <div>Start Tracking</div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
