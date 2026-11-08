// PROTOTYPE (throwaway, issue #419): three variants of the login page with
// OIDC, switchable via `?variant=A|B|C` on the existing `/login` route.
// No real sign-in: buttons only log.
import { useState } from "react";
import { ChevronDown, KeyRound, LogIn } from "lucide-react";
import { AuthCard } from "#/features/auth/auth-card.tsx";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
    PrototypeStubPanel,
    PrototypeSwitcher,
    StubToggle,
    usePrototypeParam,
} from "#/components/prototype-switcher.tsx";

const PROVIDER = "Authelia";
const VARIANTS = [
    { key: "A", name: "SSO first, divider, password" },
    { key: "B", name: "Password first, SSO as text button" },
    { key: "C", name: "SSO only, password behind disclosure" },
];

interface StubState {
    oidcOnly: boolean;
    unlinkedError: boolean;
}

function PasswordForm() {
    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
                e.preventDefault();
                console.log("PROTOTYPE password sign-in");
            }}
        >
            <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" autoComplete="username" />
            </Field>
            <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" />
            </Field>
            <Button type="submit" variant="filled" className="mt-2 self-center">
                <LogIn />
                Sign in
            </Button>
        </form>
    );
}

function UnlinkedError() {
    return (
        <p
            role="alert"
            className="rounded-md bg-error-container p-3 text-body-medium
                text-on-error-container"
        >
            No account is linked to this {PROVIDER} identity. Ask for an invite.
        </p>
    );
}

function SsoButton({ variant }: { variant: "filled" | "outline" | "text" }) {
    return (
        <Button
            variant={variant}
            className="self-stretch"
            onClick={() => console.log("PROTOTYPE redirect to IdP")}
        >
            <KeyRound />
            Sign in with {PROVIDER}
        </Button>
    );
}

function VariantA({ oidcOnly, unlinkedError }: StubState) {
    return (
        <AuthCard title="Sign in">
            <div className="flex flex-col gap-4">
                {unlinkedError && <UnlinkedError />}
                <SsoButton variant="filled" />
                {!oidcOnly && (
                    <>
                        <div
                            className="flex items-center gap-3 text-label-medium
                                text-on-surface-variant"
                        >
                            <span className="h-px flex-1 bg-outline-variant" />
                            or
                            <span className="h-px flex-1 bg-outline-variant" />
                        </div>
                        <PasswordForm />
                    </>
                )}
            </div>
        </AuthCard>
    );
}

function VariantB({ oidcOnly, unlinkedError }: StubState) {
    return (
        <AuthCard title="Sign in">
            <div className="flex flex-col gap-4">
                {unlinkedError && <UnlinkedError />}
                {oidcOnly ? (
                    <SsoButton variant="filled" />
                ) : (
                    <>
                        <PasswordForm />
                        <SsoButton variant="text" />
                    </>
                )}
            </div>
        </AuthCard>
    );
}

function VariantC({ oidcOnly, unlinkedError }: StubState) {
    const [open, setOpen] = useState(false);
    return (
        <AuthCard title="Finances">
            <div className="flex flex-col items-center gap-6">
                <p
                    className="text-center text-body-large
                        text-on-surface-variant"
                >
                    Sign in with your {PROVIDER} account.
                </p>
                {unlinkedError && <UnlinkedError />}
                <Button
                    variant="filled"
                    className="h-14 self-stretch text-title-medium"
                    onClick={() => console.log("PROTOTYPE redirect to IdP")}
                >
                    <KeyRound />
                    Continue with {PROVIDER}
                </Button>
                {!oidcOnly && (
                    <div className="flex w-full flex-col gap-4">
                        <Button
                            variant="ghost"
                            className="self-center"
                            onClick={() => setOpen(!open)}
                        >
                            Use username and password
                            <ChevronDown
                                className={open ? "rotate-180" : undefined}
                            />
                        </Button>
                        {open && <PasswordForm />}
                    </div>
                )}
            </div>
        </AuthCard>
    );
}

export function LoginPrototype() {
    const variant = usePrototypeParam(
        "variant",
        VARIANTS.map((v) => v.key),
    );
    const [stub, setStub] = useState<StubState>({
        oidcOnly: false,
        unlinkedError: false,
    });
    return (
        <>
            {variant === "A" && <VariantA {...stub} />}
            {variant === "B" && <VariantB {...stub} />}
            {variant === "C" && <VariantC {...stub} />}
            <div className="fixed top-2 left-2">
                <PrototypeStubPanel>
                    <StubToggle
                        label="OIDC_ONLY"
                        checked={stub.oidcOnly}
                        onChange={(oidcOnly) => setStub({ ...stub, oidcOnly })}
                    />
                    <StubToggle
                        label="unlinked identity error"
                        checked={stub.unlinkedError}
                        onChange={(unlinkedError) =>
                            setStub({ ...stub, unlinkedError })
                        }
                    />
                </PrototypeStubPanel>
            </div>
            <PrototypeSwitcher variants={VARIANTS} current={variant} />
        </>
    );
}
