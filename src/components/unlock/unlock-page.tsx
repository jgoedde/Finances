import { Input } from "@/components/ui/input.tsx";
import { useCallback, useState } from "react";
import { useEncryption } from "@/components/use-encryption.ts";
import { Button } from "@/components/ui/button.tsx";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";
import { useAppDispatch } from "@/hooks.ts";
import { loadExpenses } from "@/components/expenses/actions.ts";

export function UnlockPage() {
    const dispatch = useAppDispatch();

    const [keyLocal, setKeyLocal] = useState("");

    const { setKey } = useEncryption();
    const [, route] = useLocation();

    const onSubmit = useCallback(() => {
        if (keyLocal.trim() === "") return;

        setKey(keyLocal);

        dispatch(loadExpenses({ key: keyLocal }));
        // TODO: allow specifying the name of the file and store it in the local storage
        // similar to BTC wallets

        route("/");
    }, [keyLocal, setKey, dispatch, route]);

    return (
        <div
            className={
                "flex h-dvh w-full flex-col items-center justify-center gap-8"
            }
        >
            <div
                className={
                    "bg-primary-container text-on-primary-container rounded-3xl p-12"
                }
            >
                <div
                    className={
                        "mb-8 flex flex-col items-center justify-center gap-y-2"
                    }
                >
                    <h1 className={"font-poppins text-2xl font-bold"}>
                        App is locked
                    </h1>
                    <Lock className={"size-16"} />
                </div>
                <form
                    className={
                        "flex flex-col items-center justify-center gap-y-2"
                    }
                    onSubmit={onSubmit}
                >
                    <Input
                        value={keyLocal}
                        type={"password"}
                        onChange={(e) => setKeyLocal(e.target.value)}
                        placeholder={"Enter your key"}
                        className={"border-outline w-[150px]"}
                    />
                    <Button type={"submit"} variant={"ghost"}>
                        Continue
                    </Button>
                </form>
            </div>
        </div>
    );
}
