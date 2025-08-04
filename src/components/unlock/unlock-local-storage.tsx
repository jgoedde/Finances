import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { Hand } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "../ui/label";
import { Input } from "@/components/ui/input.tsx";
import { useDbValidation } from "@/components/unlock/use-db-validation.ts";
import { useAppDispatch } from "@/redux-hooks.ts";
import { loadExpenses } from "@/components/expenses/actions.ts";
import { useEncryption } from "@/components/use-encryption.ts";
import { maybeMigrateLocalStorage } from "@/lib/app-local-storage.ts";
import { useNavigate } from "@tanstack/react-router";

type Props = {
    encryptedDatabase: string;
};

export const UnlockLocalStorage: FC<Props> = ({ encryptedDatabase }) => {
    const dispatch = useAppDispatch();

    const { setKey } = useEncryption();
    const navigate = useNavigate();
    const [keyLocal, setKeyLocal] = useState("");
    const { validationTries, isValidDatabase, testDatabase, isDecrypting } =
        useDbValidation({ encryptedDatabase, secretKey: keyLocal });

    function isContinueButtonDisabled() {
        return keyLocal.trim() === "";
    }

    useEffect(() => {
        if (isValidDatabase) {
            (async () => {
                setKey(keyLocal);

                await maybeMigrateLocalStorage({ key: keyLocal });

                void dispatch(loadExpenses({ key: keyLocal }));
                void navigate({ to: "/" });
            })();
        }
    }, [dispatch, isValidDatabase, keyLocal, setKey]);

    return (
        <AlertDialog open>
            <AlertDialogContent>
                <AlertDialogHeader className={"flex flex-col items-center"}>
                    <Hand className={"text-secondary size-6"} />
                    <AlertDialogTitle className={"mb-2"}>
                        Welcome back
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        We are securely watching over your data. Please enter
                        your passphrase to start tracking expenses.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className={"flex flex-col gap-y-2"}>
                    <RadioGroup defaultValue="db-1">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="db-1" id="db-1" />
                            <Label htmlFor="db-1">Database 1</Label>
                        </div>
                    </RadioGroup>
                    <div className={"text-on-surface-variant text-sm"}>
                        <div className={"flex flex-col gap-y-2"}>
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
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={() => {
                            void testDatabase();
                        }}
                        disabled={isContinueButtonDisabled()}
                    >
                        Unlock
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
