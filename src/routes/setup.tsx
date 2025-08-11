import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent } from "react";
import { Check, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { useEncryption } from "@/components/use-encryption.ts";

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

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!key) {
            return;
        }

        void navigate({ to: "/" });
    }

    return (
        <div className={"flex h-dvh items-center justify-center"}>
            <div className="bg-surface-container-highest w-full max-w-sm rounded-2xl p-6 shadow-xl">
                <h2 className="font-poppins mb-6 text-center text-2xl font-semibold">
                    Entschlüsselung
                </h2>

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
