// PROTOTYPE (throwaway, issue #419): three variants of the sign-in methods
// section, mounted at the top of the existing `/settings` page via
// `?variant=A|B|C`. State is stubbed in memory; nothing is linked.
import { useState } from "react";
import { Check, KeyRound, Lock, Unlink } from "lucide-react";
import { Card } from "#/components/ui/card.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Switch } from "#/components/ui/switch.tsx";
import {
    PrototypeStubPanel,
    PrototypeSwitcher,
    StubToggle,
    usePrototypeParam,
} from "#/components/prototype-switcher.tsx";

const PROVIDER = "Authelia";
const VARIANTS = [
    { key: "A", name: "Method list with per-row actions" },
    { key: "B", name: "Single switch" },
    { key: "C", name: "Account header with chips" },
];

interface Stub {
    hasPassword: boolean;
    connected: boolean;
    conflict: boolean;
}

interface VariantProps {
    stub: Stub;
    setConnected: (connected: boolean) => void;
}

function ConflictError() {
    return (
        <p role="alert" className="text-body-medium text-error">
            This {PROVIDER} identity is already linked to another user.
        </p>
    );
}

function connect(stub: Stub, setConnected: (c: boolean) => void) {
    console.log("PROTOTYPE redirect to IdP to connect");
    if (!stub.conflict) setConnected(true);
}

function VariantA({ stub, setConnected }: VariantProps) {
    return (
        <Card className="gap-3 p-4">
            <h2 className="font-brand text-title-large">Sign-in methods</h2>
            <ul className="flex flex-col divide-y divide-outline-variant">
                <li className="flex items-center gap-3 py-3">
                    <Lock className="text-on-surface-variant" />
                    <div className="flex flex-1 flex-col">
                        <span className="text-body-large">Password</span>
                        <span
                            className="text-body-medium text-on-surface-variant"
                        >
                            {stub.hasPassword
                                ? "Set"
                                : "Not set. Ask an admin for a reset link."}
                        </span>
                    </div>
                </li>
                <li className="flex items-center gap-3 py-3">
                    <KeyRound className="text-on-surface-variant" />
                    <div className="flex flex-1 flex-col">
                        <span className="text-body-large">{PROVIDER}</span>
                        <span
                            className="text-body-medium text-on-surface-variant"
                        >
                            {stub.connected ? "Connected" : "Not connected"}
                        </span>
                    </div>
                    {stub.connected ? (
                        <Button
                            variant="text"
                            disabled={!stub.hasPassword}
                            onClick={() => setConnected(false)}
                        >
                            Disconnect
                        </Button>
                    ) : (
                        <Button
                            variant="filledTonal"
                            onClick={() => connect(stub, setConnected)}
                        >
                            Connect
                        </Button>
                    )}
                </li>
            </ul>
            {stub.connected && !stub.hasPassword && (
                <p className="text-body-small text-on-surface-variant">
                    {PROVIDER} is your only sign-in method, so it can't be
                    disconnected.
                </p>
            )}
            {stub.conflict && <ConflictError />}
        </Card>
    );
}

function VariantB({ stub, setConnected }: VariantProps) {
    const locked = stub.connected && !stub.hasPassword;
    return (
        <Card className="gap-3 p-4">
            <div className="flex items-center justify-between gap-4">
                <h2 className="font-brand text-title-large">
                    <label htmlFor="idp-switch">Sign in with {PROVIDER}</label>
                </h2>
                <Switch
                    id="idp-switch"
                    checked={stub.connected}
                    disabled={locked}
                    onCheckedChange={(on) =>
                        on ? connect(stub, setConnected) : setConnected(false)
                    }
                />
            </div>
            <p className="text-body-medium text-on-surface-variant">
                {locked
                    ? `${PROVIDER} is your only way to sign in, so it stays on.`
                    : `Use your ${PROVIDER} account instead of typing a password. Turning it on takes you to ${PROVIDER} to confirm.`}
            </p>
            {stub.conflict && <ConflictError />}
        </Card>
    );
}

function VariantC({ stub, setConnected }: VariantProps) {
    return (
        <Card variant="outlined" className="gap-4 p-4 [column-span:all]">
            <div className="flex items-center gap-4">
                <div
                    className="flex size-12 items-center justify-center
                        rounded-full bg-primary-container font-brand
                        text-title-large text-on-primary-container"
                >
                    J
                </div>
                <div className="flex flex-col gap-1">
                    <span className="font-brand text-title-large">julian</span>
                    <div className="flex flex-wrap gap-1">
                        {stub.hasPassword && (
                            <Badge variant="md3">
                                <Lock />
                                Password
                            </Badge>
                        )}
                        {stub.connected && (
                            <Badge variant="md3">
                                <Check />
                                {PROVIDER}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
            {stub.connected ? (
                <Button
                    variant="outline"
                    className="self-start"
                    disabled={!stub.hasPassword}
                    onClick={() => setConnected(false)}
                >
                    <Unlink />
                    Disconnect {PROVIDER}
                </Button>
            ) : (
                <Button
                    variant="filled"
                    className="self-start"
                    onClick={() => connect(stub, setConnected)}
                >
                    <KeyRound />
                    Connect {PROVIDER}
                </Button>
            )}
            {stub.conflict && <ConflictError />}
        </Card>
    );
}

export function SettingsSignInPrototype() {
    const variant = usePrototypeParam(
        "variant",
        VARIANTS.map((v) => v.key),
    );
    const [stub, setStub] = useState<Stub>({
        hasPassword: true,
        connected: false,
        conflict: false,
    });
    const props: VariantProps = {
        stub,
        setConnected: (connected) => setStub({ ...stub, connected }),
    };
    return (
        <>
            <PrototypeStubPanel>
                <StubToggle
                    label="has password"
                    checked={stub.hasPassword}
                    onChange={(hasPassword) =>
                        setStub({ ...stub, hasPassword })
                    }
                />
                <StubToggle
                    label="connected"
                    checked={stub.connected}
                    onChange={(connected) => setStub({ ...stub, connected })}
                />
                <StubToggle
                    label="connect fails: already linked"
                    checked={stub.conflict}
                    onChange={(conflict) => setStub({ ...stub, conflict })}
                />
            </PrototypeStubPanel>
            {variant === "A" && <VariantA {...props} />}
            {variant === "B" && <VariantB {...props} />}
            {variant === "C" && <VariantC {...props} />}
            <PrototypeSwitcher variants={VARIANTS} current={variant} />
        </>
    );
}
