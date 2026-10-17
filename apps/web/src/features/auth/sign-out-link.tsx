import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/auth/auth-client.ts";

export function SignOutLink() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    async function signOut() {
        const { error } = await authClient.signOut();
        if (error) {
            toast.error("Abmelden fehlgeschlagen. Bitte versuche es erneut.");
            return;
        }
        queryClient.clear();
        await navigate({ to: "/login" });
    }

    return (
        <button
            type={"button"}
            className={`text-primary focus-ring cursor-pointer rounded-xs
                underline-offset-4 hover:underline`}
            onClick={() => void signOut()}
        >
            Abmelden
        </button>
    );
}
