import { useAppDispatch } from "@/redux-hooks.ts";
import { useCallback, useEffect, useState } from "react";
import { useFileDialog } from "@mantine/hooks";
import { useEncryption } from "@/components/use-encryption.ts";
import { useLocation } from "wouter";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { Check, Hand } from "lucide-react";
import { Input } from "../ui/input";
import { loadExpenses } from "@/components/expenses/actions.ts";
import { useDbValidation } from "@/components/unlock/use-db-validation.ts";

export const SetupWizard = () => {
    const dispatch = useAppDispatch();

    const { setKey } = useEncryption();
    const [, route] = useLocation();

    const [keyLocal, setKeyLocal] = useState("");
    const [keyLocalConfirm, setKeyLocalConfirm] = useState("");
    const [encryptedDatabase, setEncryptedDatabase] = useState<string>();
    const [step, setStep] = useState<"home" | "import" | "empty">("home");

    const { validationTries, isValidDatabase, testDatabase, isDecrypting } =
        useDbValidation({ encryptedDatabase, secretKey: keyLocal });

    const { open, files } = useFileDialog({ accept: ".txt", multiple: false });

    useEffect(() => {
        async function readText(f: File) {
            const s = await f.text();
            setEncryptedDatabase(s);
        }

        if (files?.length === 1 && files[0].type === "text/plain") {
            void readText(files[0]);
            setStep("import");
        }
    }, [files]);

    const onImportDatabaseButtonClick = useCallback(() => {
        open();
    }, [open]);

    const isContinueButtonDisabled = () => {
        if (isDecrypting) {
            return true;
        }
        if (step === "empty") {
            if (keyLocal !== keyLocalConfirm) {
                return true;
            }
            return (
                keyLocal.trim() !== keyLocalConfirm.trim() ||
                keyLocal.trim() === ""
            );
        }
        if (step === "import") {
            return keyLocal.trim() === "";
        }

        return false;
    };

    const onContinueButtonClick = useCallback(async () => {
        if (step === "home") {
            setStep("empty");
        } else if (step === "import" && isValidDatabase) {
            setKey(keyLocal);
            localStorage.setItem("expenses", encryptedDatabase as string);

            void dispatch(
                loadExpenses({
                    key: keyLocal,
                }),
            );
            route("/");
        } else if (step === "import" && !isValidDatabase) {
            await testDatabase();
        } else if (step === "empty") {
            setKey(keyLocal);
            localStorage.setItem("expenses", JSON.stringify(""));

            void dispatch(
                loadExpenses({
                    key: keyLocal,
                }),
            );
            route("/");
        }
    }, [
        dispatch,
        encryptedDatabase,
        isValidDatabase,
        keyLocal,
        route,
        setKey,
        step,
        testDatabase,
    ]);

    function getRightButtonText() {
        if (step === "home") {
            return "Continue";
        }
        if (step === "import") {
            if (isValidDatabase) {
                return "Finish";
            } else {
                return "Continue";
            }
        }
        if (step === "empty") {
            return "Continue";
        }
        return "Continue";
    }

    return (
        <AlertDialog open>
            <AlertDialogContent>
                <AlertDialogHeader className={"flex flex-col items-center"}>
                    <Hand className={"text-secondary size-6"} />
                    <AlertDialogTitle className={"mb-2"}>
                        Welcome to your expenses tracker!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        You can start tracking your expenses now or import an
                        existing database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className={"text-on-surface-variant text-sm"}>
                    {step === "empty" && (
                        <form
                            onSubmit={() => {
                                if (!isContinueButtonDisabled()) {
                                    void onContinueButtonClick();
                                }
                            }}
                            className={"flex flex-col space-y-3"}
                        >
                            <div className={"text-sm"}>
                                Let's begin by creating a new database and
                                setting up your passphrase.
                            </div>
                            <Input
                                value={keyLocal}
                                type={"password"}
                                onChange={(e) => setKeyLocal(e.target.value)}
                                placeholder={"Passphrase"}
                                className={"w-full border-none text-sm"}
                            />
                            <Input
                                value={keyLocalConfirm}
                                type={"password"}
                                onChange={(e) =>
                                    setKeyLocalConfirm(e.target.value)
                                }
                                placeholder={"Passphrase (confirm)"}
                                className={"w-full border-none text-sm"}
                            />
                        </form>
                    )}
                    {files?.length === 1 &&
                        files?.[0]?.type !== "text/plain" && (
                            <div className={"text-error"}>
                                Imported database <em>{files[0].name}</em> is in
                                wrong format, expected a .txt file.
                            </div>
                        )}
                    {encryptedDatabase !== undefined && (
                        <div className={"flex flex-col gap-y-2"}>
                            <div className={"flex items-center gap-x-2"}>
                                <Check className={"size-5"} />
                                Database imported
                            </div>
                            {isValidDatabase && (
                                <div className={"flex items-center gap-x-2"}>
                                    <Check className={"size-5"} />
                                    Database valid
                                </div>
                            )}
                            {!isValidDatabase &&
                                validationTries >= 1 &&
                                !isDecrypting && (
                                    <div
                                        className={
                                            "text-error flex items-center gap-x-2"
                                        }
                                    >
                                        Invalid passphrase. Please try again.
                                    </div>
                                )}
                            {!isValidDatabase && (
                                <div className={"flex justify-between gap-x-3"}>
                                    <Input
                                        value={keyLocal}
                                        type={"password"}
                                        onChange={(e) =>
                                            setKeyLocal(e.target.value)
                                        }
                                        placeholder={"Passphrase"}
                                        className={"w-full border-none text-sm"}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <AlertDialogFooter>
                    {step === "home" && (
                        <AlertDialogAction
                            onClick={onImportDatabaseButtonClick}
                        >
                            Import database
                        </AlertDialogAction>
                    )}
                    {step === "empty" && (
                        <AlertDialogAction
                            onClick={() => {
                                setStep("home");
                            }}
                        >
                            Back
                        </AlertDialogAction>
                    )}
                    <AlertDialogAction
                        disabled={isContinueButtonDisabled()}
                        onClick={onContinueButtonClick}
                    >
                        {getRightButtonText()}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
