import { createAuthClient } from "better-auth/client";
import { usernameClient } from "better-auth/client/plugins";
import { queryOptions } from "@tanstack/react-query";

export const authClient = createAuthClient({
    basePath: "/api/auth",
    plugins: [usernameClient()],
});

export interface SessionUser {
    id: string;
    username: string;
}

/** The signed-in user, or null. */
export const sessionQuery = queryOptions({
    queryKey: ["session"],
    queryFn: async (): Promise<SessionUser | null> => {
        const { data, error } = await authClient.getSession();
        if (error) {
            throw error;
        }
        if (!data) {
            return null;
        }
        return {
            id: data.user.id,
            username: data.user.username ?? data.user.name,
        };
    },
    staleTime: 5 * 60 * 1000,
});
