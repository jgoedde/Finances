import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { type SubmitEvent, useState } from "react";
import { z } from "zod";
import { LogIn } from "lucide-react";
import {
    authClient,
    completeSignIn,
    sessionQuery,
} from "#/auth/auth-client.ts";
import { AuthCard } from "#/features/auth/auth-card.tsx";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Button } from "#/components/ui/button.tsx";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/login")({
    validateSearch: z.object({
        redirect: z.string().optional().catch(undefined),
    }),
    beforeLoad: async ({ context }) => {
        if (
            await context.queryClient.query({
                ...sessionQuery,
                staleTime: "static",
            })
        ) {
            throw redirect({ to: "/" });
        }
    },
    head: () => ({
        meta: [{ title: m.page_title({ page: m.action_sign_in() }) }],
    }),
    component: RouteComponent,
});

function RouteComponent() {
    const { redirect: redirectTo } = Route.useSearch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const result = await authClient.signIn.username({
            username: username.trim(),
            password,
        });
        setIsSubmitting(false);

        if (result.error) {
            setError(
                result.error.status === 401
                    ? m.login_wrong_credentials()
                    : m.login_failed(),
            );
            return;
        }

        await completeSignIn(queryClient);
        // Only follow same-app redirects.
        await navigate({
            href: redirectTo?.startsWith("/") ? redirectTo : "/",
        });
    }

    return (
        <AuthCard title={m.action_sign_in()}>
            <form
                className="flex flex-col gap-4"
                onSubmit={(e) => void handleSubmit(e)}
            >
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
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor={"password"}>
                        {m.auth_password()}
                    </FieldLabel>
                    <Input
                        id={"password"}
                        type={"password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={"current-password"}
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
                    <LogIn />
                    {m.action_sign_in()}
                </Button>
            </form>
        </AuthCard>
    );
}
