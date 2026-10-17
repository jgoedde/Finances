import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import type { LinkInfo, RedeemLinkInput } from "@finances/shared";
import { ApiError, apiFetch } from "@/api/api-client.ts";
import { authClient, completeSignIn } from "@/auth/auth-client.ts";
import { AuthCard } from "@/features/auth/auth-card.tsx";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

export const Route = createFileRoute("/link/$token")({
    component: RouteComponent,
});

const MIN_PASSWORD_LENGTH = 8;

function RouteComponent() {
    const { token } = Route.useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const link = useQuery({
        queryKey: ["links", token],
        queryFn: () => apiFetch<LinkInfo>(`/links/${token}`),
        retry: false,
        staleTime: Infinity,
    });

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (link.isPending) {
        return <AuthCard title={"Link"}>{null}</AuthCard>;
    }

    if (link.isError) {
        return (
            <AuthCard title={"Link"}>
                <p className="text-on-surface-variant text-body-medium">
                    Dieser Link ist ungültig, abgelaufen oder wurde bereits
                    verwendet. Bitte frage nach einem neuen.
                </p>
            </AuthCard>
        );
    }

    const linkInfo = link.data;
    const isSignup = linkInfo.kind === "invite";

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (password !== passwordRepeat) {
            setError("Die Passwörter stimmen nicht überein.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            const body: RedeemLinkInput = isSignup
                ? { username, password }
                : { password };
            await apiFetch(`/links/${token}/redeem`, {
                method: "POST",
                body,
            });
        } catch (e) {
            setIsSubmitting(false);
            setError(
                e instanceof ApiError && e.status === 409
                    ? "Dieser Benutzername ist bereits vergeben."
                    : e instanceof ApiError && e.status === 400
                      ? "Benutzername: 3–30 Zeichen (Buchstaben, Ziffern, _ und .)."
                      : "Das hat nicht geklappt. Bitte versuche es erneut.",
            );
            return;
        }

        const loginName = isSignup ? username : (linkInfo.username ?? "");
        const result = await authClient.signIn.username({
            username: loginName.trim(),
            password,
        });
        if (result.error) {
            toast.success("Passwort gespeichert. Bitte melde Dich an.");
            await navigate({ to: "/login" });
            return;
        }
        await completeSignIn(queryClient);
        toast.success(isSignup ? "Willkommen!" : "Passwort geändert");
        await navigate({ to: "/" });
    }

    return (
        <AuthCard
            title={isSignup ? "Konto erstellen" : "Neues Passwort festlegen"}
        >
            <form
                className="flex flex-col gap-4"
                onSubmit={(e) => void handleSubmit(e)}
            >
                {isSignup ? (
                    <Field>
                        <FieldLabel htmlFor={"username"}>
                            Benutzername
                        </FieldLabel>
                        <Input
                            id={"username"}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete={"username"}
                            autoCapitalize={"none"}
                            autoFocus
                            required
                            minLength={3}
                            maxLength={30}
                            pattern={"[a-zA-Z0-9_.]+"}
                        />
                    </Field>
                ) : (
                    <p className="text-on-surface-variant text-body-medium">
                        Für <strong>{linkInfo.username}</strong>
                    </p>
                )}
                <Field>
                    <FieldLabel htmlFor={"password"}>Passwort</FieldLabel>
                    <Input
                        id={"password"}
                        type={"password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={"new-password"}
                        required
                        minLength={MIN_PASSWORD_LENGTH}
                    />
                    <FieldDescription>
                        Mindestens {MIN_PASSWORD_LENGTH} Zeichen
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor={"password-repeat"}>
                        Passwort wiederholen
                    </FieldLabel>
                    <Input
                        id={"password-repeat"}
                        type={"password"}
                        value={passwordRepeat}
                        onChange={(e) => setPasswordRepeat(e.target.value)}
                        autoComplete={"new-password"}
                        required
                    />
                </Field>
                {error && (
                    <p role={"alert"} className="text-error text-body-medium">
                        {error}
                    </p>
                )}
                <Button
                    type="submit"
                    variant={"filled"}
                    disabled={isSubmitting}
                    className={"mt-2 self-center"}
                >
                    <Check />
                    Speichern
                </Button>
            </form>
        </AuthCard>
    );
}
