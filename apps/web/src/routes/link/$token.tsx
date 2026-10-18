import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type SubmitEvent, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import type { LinkInfo, RedeemLinkInput } from "@finances/shared";
import { apiFetch } from "#/api/api-client.ts";
import { apiErrorCode, apiErrorMessage } from "#/api/api-errors.ts";
import { authClient, completeSignIn } from "#/auth/auth-client.ts";
import { AuthCard } from "#/features/auth/auth-card.tsx";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Button } from "#/components/ui/button.tsx";
import { m } from "#/paraglide/messages.js";

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
        return <AuthCard title={m.link_title()}>{null}</AuthCard>;
    }

    if (link.isError) {
        return (
            <AuthCard title={m.link_title()}>
                <p className="text-body-medium text-on-surface-variant">
                    {m.link_invalid()}
                </p>
            </AuthCard>
        );
    }

    const linkInfo = link.data;
    const isSignup = linkInfo.kind === "invite";

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (password !== passwordRepeat) {
            setError(m.link_passwords_differ());
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
            const code = apiErrorCode(e);
            // Only the username can fail validation.
            setError(
                code === "invalid_request"
                    ? m.link_username_rules()
                    : (apiErrorMessage(code) ?? m.error_try_again()),
            );
            return;
        }

        const loginName = isSignup ? username : (linkInfo.username ?? "");
        const result = await authClient.signIn.username({
            username: loginName.trim(),
            password,
        });
        if (result.error) {
            toast.success(m.link_password_saved_sign_in());
            await navigate({ to: "/login" });
            return;
        }
        await completeSignIn(queryClient);
        toast.success(isSignup ? m.link_welcome() : m.link_password_changed());
        await navigate({ to: "/" });
    }

    return (
        <AuthCard
            title={
                isSignup ? m.link_create_account() : m.link_set_new_password()
            }
        >
            <form
                className="flex flex-col gap-4"
                onSubmit={(e) => void handleSubmit(e)}
            >
                {isSignup ? (
                    <Field>
                        <FieldLabel htmlFor={"username"}>
                            {m.auth_username()}
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
                    <p className="text-body-medium text-on-surface-variant">
                        {m.link_for_user()} <strong>{linkInfo.username}</strong>
                    </p>
                )}
                <Field>
                    <FieldLabel htmlFor={"password"}>
                        {m.auth_password()}
                    </FieldLabel>
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
                        {m.link_min_password_length({
                            count: MIN_PASSWORD_LENGTH,
                        })}
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor={"password-repeat"}>
                        {m.link_repeat_password()}
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
                    <p role={"alert"} className="text-body-medium text-error">
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
                    {m.action_save()}
                </Button>
            </form>
        </AuthCard>
    );
}
