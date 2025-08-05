import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { Check, FilePenLine, KeyRound } from "lucide-react";
import { useLocalStorage } from "@mantine/hooks";

export const Route = createFileRoute("/setup")({
    component: RouteComponent,
});

export interface LsLogin {
    pat: string;
    gistName: string;
}

function RouteComponent() {
    const [, setLsLogin] = useLocalStorage<LsLogin>({ key: "finances-login" });
    const navigate = useNavigate();

    const [token, setToken] = useState("");
    const [gistName, setCustomText] = useState("");

    async function isAuthenticated(): Promise<boolean> {
        if (!token) {
            return false;
        }

        try {
            const response = await fetch(`https://api.github.com/gists`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.status !== 401;
        } catch (e) {
            console.error("Error checking authentication:", e);
            return false;
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!token || !gistName) {
            return;
        }

        debugger;

        const auth = await isAuthenticated();

        return;

        // Save the token and gist name to local storage
        setLsLogin({
            pat: token,
            gistName: gistName,
        });

        void navigate({ to: "/" });
    }

    return (
        <div className={"flex h-dvh items-center justify-center"}>
            <div className="bg-surface-container-highest w-full max-w-sm rounded-2xl p-6 shadow-xl">
                <h2 className="font-poppins mb-6 text-center text-2xl font-semibold">
                    Mit GitHub einloggen
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* GitHub Token Input */}
                    <div>
                        <div className={"flex gap-x-8"}>
                            <div className={"text-secondary size-4"}>
                                <KeyRound />
                            </div>
                            <div className={"w-full"}>
                                <label
                                    htmlFor="token"
                                    className="block text-sm"
                                >
                                    GitHub Personal Access Token
                                </label>
                                <input
                                    type="password"
                                    id="token"
                                    name="token"
                                    placeholder="ghp_**************"
                                    className="border-outline mt-1 block w-full rounded-xs border px-4 py-2 text-sm shadow-sm"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    required
                                />
                                <div
                                    className={
                                        "text-on-surface-variant mx-auto mt-2 text-xs"
                                    }
                                >
                                    Der Token muss die Rolle{" "}
                                    <strong>Gists</strong> haben.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Custom Text Input */}
                    <div className={"flex gap-x-8"}>
                        <div className={"text-secondary size-4"}>
                            <FilePenLine />
                        </div>
                        <div className={"w-full"}>
                            <label htmlFor="gistName" className="block text-sm">
                                Gist Name
                            </label>
                            <div className="relative mt-1 h-10">
                                <input
                                    type="text"
                                    id="gistName"
                                    name="gistName"
                                    placeholder="my-finances"
                                    className="border-outline absolute block w-full rounded-xs border px-4 py-2 pr-12 text-sm shadow-sm"
                                    value={gistName}
                                    onChange={(e) =>
                                        setCustomText(e.target.value)
                                    }
                                    required
                                />
                                <span className="text-on-surface-variant pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                                    .enc
                                </span>
                            </div>
                            <div
                                className={
                                    "text-on-surface-variant mx-auto mt-2 text-xs"
                                }
                            >
                                Unter diesem Namen wird die Datenbank über Deine
                                Ausgaben verschlüsselt gespeichert.
                            </div>
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
