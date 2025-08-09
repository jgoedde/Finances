import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
    type ChangeEvent,
    type FormEvent,
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    Check,
    CloudCheck,
    FilePenLine,
    KeyRound,
    SquareCode,
    TriangleAlert,
} from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "@/lib/utils.ts";
import { Input } from "@/components/ui/input.tsx";
import { useGitHubClient } from "@/gitHubClient.tsx";
import { useGitHubConfig } from "@/hooks/useGitHubConfig.ts";
import { useEncryption } from "@/components/use-encryption.ts";

export const Route = createFileRoute("/setup")({
    component: RouteComponent,
});

export interface GitHubConfig {
    gistName: string;
    pat?: string;
    gistId?: string;
}

interface GistResponse {
    id: string;
    files: Record<string, never>;
    owner: {
        login: string;
    };
}

type GetGistsResponse = GistResponse[];

function RouteComponent() {
    const navigate = useNavigate();

    const [gitHubConfig, setGitHubConfig] = useGitHubConfig();
    const gitHubClient = useGitHubClient();
    const { key, setKey } = useEncryption();

    const [errorText, setErrorText] = useState("");
    const [authCheck, setAuthCheck] = useState<
        | {
              isAuthenticated: true;
              gists: { name: string; id: string }[];
              gitHubUserName: string;
          }
        | {
              isAuthenticated: false;
          }
    >({ isAuthenticated: false });
    const [gistNameTmp, setGistNameTmp] = useState<string>(
        gitHubConfig.gistName.split(".")[0] || "",
    );

    const selectedGistId = !authCheck.isAuthenticated
        ? undefined
        : authCheck.gists.find((g) => g.name === gitHubConfig.gistName)?.id;

    const isAuthenticated = useCallback(async (): Promise<
        | { isAuthenticated: true; ownerName: string; gists: GetGistsResponse }
        | { isAuthenticated: false }
    > => {
        if (!gitHubConfig.pat || gitHubConfig.pat.trim() === "") {
            return { isAuthenticated: false };
        }

        try {
            const response = await fetch(`https://api.github.com/gists`, {
                headers: {
                    Authorization: `Bearer ${gitHubConfig.pat}`,
                },
            });

            const authed = response.status !== 401;
            if (authed) {
                const data = (await response.json()) as GetGistsResponse;
                return {
                    isAuthenticated: true,
                    gists: data,
                    ownerName: data.length > 0 ? data[0].owner.login : "",
                };
            }
            return { isAuthenticated: false };
        } catch (e) {
            console.error("Error checking authentication:", e);
            return { isAuthenticated: false };
        }
    }, [gitHubConfig.pat]);

    const handleTokenBlur = useCallback(async () => {
        if (!gitHubConfig.pat || gitHubConfig.pat.trim() === "") {
            return;
        }

        setErrorText(""); // Clear any previous error messages
        setAuthCheck({ isAuthenticated: false });

        const authCheck = await isAuthenticated();

        if (!authCheck.isAuthenticated) {
            setErrorText(
                "Der Token ist ungültig oder hat nicht die erforderlichen Berechtigungen.",
            );
            return;
        }

        setAuthCheck({
            gitHubUserName: authCheck.ownerName,
            isAuthenticated: true,
            gists: authCheck.gists.map((g) => ({
                id: g.id,
                name: Object.keys(g.files)[0],
            })),
        });
        setErrorText("");
    }, [isAuthenticated, gitHubConfig.pat]);

    useEffect(() => {
        void handleTokenBlur();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- We really just want to have this once because the local storage populates the local state not initially.
    }, []);

    const handleGistNameBlur = useCallback(() => {
        if (!authCheck.isAuthenticated) {
            return;
        }

        setGitHubConfig((prev) => ({
            ...prev,
            gistId: selectedGistId,
        }));
    }, [authCheck.isAuthenticated, selectedGistId, setGitHubConfig]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!authCheck.isAuthenticated || !key || gistNameTmp === "") {
            return;
        }

        if (selectedGistId == null) {
            try {
                const createdGist = await gitHubClient.gists.create({
                    public: false,
                    files: {
                        [gitHubConfig.gistName]: {
                            content: "abc",
                        },
                    },
                    description: "Verschlüsselte Datenbank für Finanzen",
                });

                const gistId = createdGist.data.id;
                setGitHubConfig((prev) => ({
                    ...prev,
                    gistId: gistId,
                }));

                void navigate({ to: "/" });
            } catch (e) {
                if (e instanceof Error) {
                    setErrorText(
                        "Fehler beim Erstellen des Gists: " + e.message,
                    );
                } else if (typeof e === "string") {
                    setErrorText("Fehler beim Erstellen des Gists: " + e);
                }
            }
        } else {
            void navigate({ to: "/" });
        }
    }

    function handleTokenChange(e: ChangeEvent<HTMLInputElement>) {
        setGitHubConfig((prev) => ({ ...prev, pat: e.target.value }));
    }

    function handleGistNameChange(e: ChangeEvent<HTMLInputElement>) {
        setGistNameTmp(e.target.value);

        if (e.target.value.trim() === "") {
            setGitHubConfig((prev) => ({
                ...prev,
                gistName: `my-finances.enc`,
            }));
        } else {
            setGitHubConfig((prev) => ({
                ...prev,
                gistName: `${e.target.value}.enc`,
                gistId: selectedGistId,
            }));
        }
    }

    return (
        <div className={"flex h-dvh items-center justify-center"}>
            <div className="bg-surface-container-highest w-full max-w-sm rounded-2xl p-6 shadow-xl">
                <h2 className="font-poppins mb-6 text-center text-2xl font-semibold">
                    Mit GitHub einloggen
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {errorText.trim() !== "" && (
                        <div
                            className={
                                "border-error bg-error/5 text-on-error-container mb-6 flex gap-x-4 rounded-sm border px-4 py-2"
                            }
                        >
                            <div className={"self-center"}>
                                <TriangleAlert className={"size-7"} />
                            </div>
                            <div>{errorText}</div>
                        </div>
                    )}

                    {/* GitHub Token Input */}
                    <div className={"flex gap-x-8"}>
                        <div className={"text-secondary size-4"}>
                            <SquareCode />
                        </div>
                        <div className={"w-full"}>
                            <label htmlFor="token" className="block text-sm">
                                GitHub Personal Access Token
                            </label>
                            <input
                                autoComplete={"current-password"}
                                type="password"
                                id="token"
                                name="token"
                                placeholder="ghp_**************"
                                className="border-outline mt-1 block w-full rounded-xs border px-4 py-2 text-sm shadow-sm"
                                value={gitHubConfig.pat ?? ""}
                                onChange={handleTokenChange}
                                onBlur={() => void handleTokenBlur()}
                                required
                            />
                            <div
                                className={
                                    "text-on-surface-variant mx-auto mt-2 text-xs"
                                }
                            >
                                Der Token muss die Rolle <strong>Gists</strong>{" "}
                                haben.
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
                                    value={gistNameTmp}
                                    onChange={handleGistNameChange}
                                    onBlur={handleGistNameBlur}
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

                    <div className={"flex gap-x-8"}>
                        <div className={"text-secondary size-4"}>
                            <KeyRound />
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
                                required
                            />
                        </div>
                    </div>

                    {authCheck.isAuthenticated && (
                        <div className={"flex flex-col gap-y-2"}>
                            <div
                                className={
                                    "text-on-surface-variant flex items-center gap-x-2 text-sm"
                                }
                            >
                                <div>
                                    <CloudCheck
                                        className={"text-primary size-4"}
                                    />
                                </div>
                                <div>
                                    {authCheck.gists.length} Gists von dem
                                    Nutzer{" "}
                                    <span className={"text-secondary"}>
                                        {authCheck.gitHubUserName}
                                    </span>{" "}
                                    gefunden
                                </div>
                            </div>
                            <div
                                className={
                                    "text-on-surface-variant flex items-center gap-x-2 text-sm"
                                }
                            >
                                <div>
                                    <DynamicIcon
                                        name={
                                            selectedGistId == null
                                                ? "file-plus"
                                                : "triangle-alert"
                                        }
                                        className={cn(
                                            "size-4",
                                            selectedGistId == null
                                                ? "text-primary"
                                                : "text-error",
                                        )}
                                    />
                                </div>
                                <div>
                                    {selectedGistId == null ? (
                                        <>
                                            Werde neuen privaten Gist{" "}
                                            <span className={"text-secondary"}>
                                                {gitHubConfig.gistName ||
                                                    "my-finances.enc"}
                                            </span>{" "}
                                            anlegen
                                        </>
                                    ) : (
                                        <>
                                            Vorhandenes Gist{" "}
                                            {gitHubConfig.gistName} wird{" "}
                                            <span className={"text-error"}>
                                                überschrieben
                                            </span>
                                        </>
                                    )}
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
