import { createAuthClient } from "better-auth/client";
import { usernameClient } from "better-auth/client/plugins";
import { type QueryClient, queryOptions } from "@tanstack/react-query";
import { syncFailures } from "@/features/sync/sync-failures.ts";

export const authClient = createAuthClient({
    basePath: "/api/auth",
    plugins: [usernameClient()],
});

export interface SessionUser {
    id: string;
    username: string;
}

/** The last user signed in on this device, to tell whose data is cached. */
const LAST_USER_KEY = "finances-last-user-id";

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
        localStorage.setItem(LAST_USER_KEY, data.user.id);
        return {
            id: data.user.id,
            username: data.user.username ?? data.user.name,
        };
    },
    staleTime: 5 * 60 * 1000,
});

/**
 * Call after a successful sign-in. The same user as before keeps the cache and
 * queued changes (they continue now); for a different user, everything from
 * the previous one is dropped.
 */
export async function completeSignIn(queryClient: QueryClient): Promise<void> {
    const previousUserId = localStorage.getItem(LAST_USER_KEY);
    const user = await queryClient.fetchQuery({
        ...sessionQuery,
        staleTime: 0,
    });
    if (user?.id === previousUserId) {
        void queryClient.invalidateQueries();
        return;
    }
    queryClient.clear();
    syncFailures.clear();
    queryClient.setQueryData(sessionQuery.queryKey, user);
}
