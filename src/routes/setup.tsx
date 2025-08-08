import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ChangeEvent, type FormEvent, useState } from "react";
import {
    Check,
    CloudCheck,
    FilePenLine,
    KeyRound,
    SquareCode,
    TriangleAlert,
} from "lucide-react";
import { useLocalStorage } from "@mantine/hooks";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "@/lib/utils.ts";
import { Input } from "@/components/ui/input.tsx";
import { useAppDispatch, useAppSelector } from "@/redux-hooks.ts";
import { selectMasterPassword, setMasterPassword } from "@/app-slice.ts";

export const Route = createFileRoute("/setup")({
    component: RouteComponent,
});

export interface LsLogin {
    pat: string;
    gistName: string;
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
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const [lsLogin, setLsLogin] = useLocalStorage<LsLogin>({
        key: "finances-login",
        defaultValue: { pat: "", gistName: "" },
    });

    const masterPassword = useAppSelector(selectMasterPassword) ?? "";

    const [errorText, setErrorText] = useState("");
    const [authCheck, setAuthCheck] = useState<
        | {
              isAuthenticated: true;
              gistNames: string[];
              gitHubUserName: string;
          }
        | {
              isAuthenticated: false;
          }
    >({ isAuthenticated: false });
    const [gistNameTmp, setGistNameTmp] = useState<string>(lsLogin.gistName);

    async function isAuthenticated(): Promise<
        | { isAuthenticated: true; ownerName: string; gistNames: string[] }
        | { isAuthenticated: false }
    > {
        if (!lsLogin.pat || lsLogin.pat.trim() === "") {
            return { isAuthenticated: false };
        }

        try {
            const response = await fetch(`https://api.github.com/gists`, {
                headers: {
                    Authorization: `Bearer ${lsLogin.pat}`,
                },
            });

            const authed = response.status !== 401;
            if (authed) {
                const data = (await response.json()) as GetGistsResponse;
                return {
                    isAuthenticated: true,
                    gistNames: data.map((gist) => Object.keys(gist.files)[0]),
                    ownerName: data.length > 0 ? data[0].owner.login : "",
                };
            }
            return { isAuthenticated: false };
        } catch (e) {
            console.error("Error checking authentication:", e);
            return { isAuthenticated: false };
        }
    }

    async function handleBlur() {
        if (!lsLogin.pat || lsLogin.pat.trim() === "") {
            return;
        }
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
            gistNames: authCheck.gistNames,
        });
        setErrorText("");
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (
            !authCheck.isAuthenticated ||
            !masterPassword ||
            gistNameTmp === ""
        ) {
            return;
        }

        void navigate({ to: "/" });
    }

    function handleTokenChange(e: ChangeEvent<HTMLInputElement>) {
        setErrorText(""); // Clear any previous error messages
        setAuthCheck({ isAuthenticated: false }); // Reset authentication check
        setLsLogin((prev) => ({ ...prev, pat: e.target.value }));
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
                    <div>
                        <div className={"flex gap-x-8"}>
                            <div className={"text-secondary size-4"}>
                                <SquareCode />
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
                                    value={lsLogin.pat}
                                    onChange={handleTokenChange}
                                    onBlur={() => void handleBlur()}
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
                                    value={gistNameTmp}
                                    onChange={(e) => {
                                        setGistNameTmp(e.target.value);
                                        setLsLogin((prev) => ({
                                            ...prev,
                                            gistName: `${e.target.value}.enc`,
                                        }));
                                    }}
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
                            <label htmlFor="token" className="block text-sm">
                                Master Passwort
                            </label>
                            <Input
                                value={masterPassword}
                                type={"password"}
                                onChange={(e) =>
                                    dispatch(setMasterPassword(e.target.value))
                                }
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
                                    {authCheck.gistNames.length} Gists von dem
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
                                            authCheck.gistNames.includes(
                                                lsLogin.gistName,
                                            )
                                                ? "triangle-alert"
                                                : "file-plus"
                                        }
                                        className={cn(
                                            "size-4",
                                            authCheck.gistNames.includes(
                                                lsLogin.gistName,
                                            )
                                                ? "text-error"
                                                : "text-primary",
                                        )}
                                    />
                                </div>
                                <div>
                                    {authCheck.gistNames.includes(
                                        lsLogin.gistName,
                                    ) ? (
                                        <>
                                            Vorhandenes Gist {lsLogin.gistName}{" "}
                                            wird{" "}
                                            <span className={"text-error"}>
                                                überschrieben
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Werde neuen privaten Gist{" "}
                                            <span className={"text-secondary"}>
                                                {lsLogin.gistName ||
                                                    "my-finances.enc"}
                                            </span>{" "}
                                            anlegen
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
