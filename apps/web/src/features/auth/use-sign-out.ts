import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "#/auth/auth-client.ts";
import { syncFailures } from "#/features/sync/sync-failures.ts";
import { m } from "#/paraglide/messages.js";

/**
 * Signs out and forgets everything cached, including unsent changes.
 */
export function useSignOut() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return async function signOut() {
        const { error } = await authClient.signOut();
        if (error) {
            toast.error(m.sign_out_failed());
            return;
        }
        queryClient.clear();
        syncFailures.clear();
        await navigate({ to: "/login" });
    };
}
