// PROTOTYPE (throwaway, issue #419): three variants of redeeming an invite
// with a password or the identity provider, on the existing `/link/$token`
// route via `?variant=A|B|C`. Uses a stub invite; nothing is redeemed.
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, KeyRound, Lock } from "lucide-react";
import { AuthCard } from "#/features/auth/auth-card.tsx";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Button } from "#/components/ui/button.tsx";
import { SegmentedButton } from "#/components/ui/segmented-button.tsx";
import { cn } from "#/lib/cn.ts";
import {
    PrototypeStubPanel,
    PrototypeSwitcher,
    StubToggle,
    usePrototypeParam,
} from "#/components/prototype-switcher.tsx";

const PROVIDER = "Authelia";
const VARIANTS = [
    { key: "A", name: "Username, then two stacked buttons" },
    { key: "B", name: "Segmented method switch" },
    { key: "C", name: "Two steps, method cards" },
];

function UsernameField({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
                id="username"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoCapitalize="none"
                autoFocus
            />
            <FieldDescription>3–30 letters, digits, _ or .</FieldDescription>
        </Field>
    );
}

function PasswordFields() {
    return (
        <>
            <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" />
                <FieldDescription>At least 8 characters</FieldDescription>
            </Field>
            <Field>
                <FieldLabel htmlFor="password-repeat">
                    Repeat password
                </FieldLabel>
                <Input id="password-repeat" type="password" />
            </Field>
        </>
    );
}

function ConflictError() {
    return (
        <p
            role="alert"
            className="rounded-md bg-error-container p-3 text-body-medium
                text-on-error-container"
        >
            This {PROVIDER} identity is already linked to another user.
        </p>
    );
}

function VariantA({ conflict }: { conflict: boolean }) {
    const [username, setUsername] = useState("");
    const [withPassword, setWithPassword] = useState(false);
    return (
        <AuthCard title="Create account">
            <div className="flex flex-col gap-4">
                <UsernameField value={username} onChange={setUsername} />
                {conflict && <ConflictError />}
                {withPassword ? (
                    <>
                        <PasswordFields />
                        <Button variant="filled" className="mt-2 self-center">
                            <Check />
                            Save
                        </Button>
                        <Button
                            variant="text"
                            className="self-center"
                            onClick={() => setWithPassword(false)}
                        >
                            Back
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="filled"
                            className="mt-2 self-stretch"
                            disabled={!username}
                            onClick={() => console.log("PROTOTYPE to IdP")}
                        >
                            <KeyRound />
                            Continue with {PROVIDER}
                        </Button>
                        <Button
                            variant="outline"
                            className="self-stretch"
                            disabled={!username}
                            onClick={() => setWithPassword(true)}
                        >
                            <Lock />
                            Set a password instead
                        </Button>
                    </>
                )}
            </div>
        </AuthCard>
    );
}

function VariantB({ conflict }: { conflict: boolean }) {
    const [username, setUsername] = useState("");
    const [method, setMethod] = useState("idp");
    return (
        <AuthCard title="Create account">
            <div className="flex flex-col gap-4">
                <UsernameField value={username} onChange={setUsername} />
                <div className="flex flex-col gap-2">
                    <span className="text-label-large text-on-surface-variant">
                        Sign in with
                    </span>
                    <SegmentedButton
                        options={[
                            { label: PROVIDER, value: "idp" },
                            { label: "Password", value: "password" },
                        ]}
                        value={method}
                        onChange={setMethod}
                    />
                </div>
                {conflict && method === "idp" && <ConflictError />}
                {method === "password" ? (
                    <>
                        <PasswordFields />
                        <Button variant="filled" className="mt-2 self-center">
                            <Check />
                            Save
                        </Button>
                    </>
                ) : (
                    <>
                        <p className="text-body-medium text-on-surface-variant">
                            You'll confirm with {PROVIDER} and come back here.
                        </p>
                        <Button
                            variant="filled"
                            className="mt-2 self-center"
                            disabled={!username}
                        >
                            <KeyRound />
                            Continue with {PROVIDER}
                        </Button>
                    </>
                )}
            </div>
        </AuthCard>
    );
}

function MethodCard({
    selected,
    onSelect,
    icon,
    title,
    description,
}: {
    selected: boolean;
    onSelect: () => void;
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={cn(
                `state-layer flex items-start gap-3 rounded-lg border p-4
                text-left focus-ring`,
                selected
                    ? `border-primary bg-secondary-container
                        text-on-secondary-container`
                    : "border-outline-variant",
            )}
        >
            <span className="mt-0.5">{icon}</span>
            <span className="flex flex-col gap-1">
                <span className="text-title-medium">{title}</span>
                <span className="text-body-medium text-on-surface-variant">
                    {description}
                </span>
            </span>
        </button>
    );
}

function VariantC({ conflict }: { conflict: boolean }) {
    const [step, setStep] = useState<1 | 2>(1);
    const [username, setUsername] = useState("");
    const [method, setMethod] = useState<"idp" | "password" | null>(null);
    // The conflict is only known after the round trip to the IdP: the page
    // comes back on step 2 with the error on top.
    if (step === 1 && !conflict) {
        return (
            <AuthCard title="Create account">
                <div className="flex flex-col gap-4">
                    <p className="text-body-medium text-on-surface-variant">
                        Step 1 of 2: choose your username.
                    </p>
                    <UsernameField value={username} onChange={setUsername} />
                    <Button
                        variant="filled"
                        className="mt-2 self-end"
                        disabled={!username}
                        onClick={() => setStep(2)}
                    >
                        Next
                        <ArrowRight />
                    </Button>
                </div>
            </AuthCard>
        );
    }
    return (
        <AuthCard title={`How will ${username || "julian"} sign in?`}>
            <div className="flex flex-col gap-3">
                {conflict && <ConflictError />}
                <MethodCard
                    selected={method === "idp"}
                    onSelect={() => setMethod("idp")}
                    icon={<KeyRound />}
                    title={`With ${PROVIDER}`}
                    description="Use the account you already have. No new password."
                />
                <MethodCard
                    selected={method === "password"}
                    onSelect={() => setMethod("password")}
                    icon={<Lock />}
                    title="With a password"
                    description="Choose a password just for this app."
                />
                {method === "password" && <PasswordFields />}
                <div className="mt-2 flex justify-between">
                    <Button variant="text" onClick={() => setStep(1)}>
                        <ArrowLeft />
                        Back
                    </Button>
                    <Button variant="filled" disabled={!method}>
                        {method === "idp"
                            ? `Continue with ${PROVIDER}`
                            : "Save"}
                    </Button>
                </div>
            </div>
        </AuthCard>
    );
}

export function InvitePrototype() {
    const variant = usePrototypeParam(
        "variant",
        VARIANTS.map((v) => v.key),
    );
    const [conflict, setConflict] = useState(false);
    return (
        <>
            {variant === "A" && <VariantA conflict={conflict} />}
            {variant === "B" && <VariantB conflict={conflict} />}
            {variant === "C" && <VariantC conflict={conflict} />}
            <div className="fixed top-2 left-2">
                <PrototypeStubPanel>
                    <StubToggle
                        label="identity already linked error"
                        checked={conflict}
                        onChange={setConflict}
                    />
                </PrototypeStubPanel>
            </div>
            <PrototypeSwitcher variants={VARIANTS} current={variant} />
        </>
    );
}
