import { createContext, type PropsWithChildren, use, useMemo } from "react";
import { Octokit } from "@octokit/rest";
import { useLocalStorage } from "@mantine/hooks";
import type { LsLogin } from "@/routes/setup.tsx";

const GitHubClientContext = createContext<Octokit | undefined>(undefined);

export function GitHubClientProvider({ children }: PropsWithChildren) {
    const [lsLogin] = useLocalStorage<LsLogin>({ key: "finances-login" });

    const octokit = useMemo(() => {
        return new Octokit({
            auth: lsLogin?.pat,
        });
    }, [lsLogin?.pat]);

    return (
        <GitHubClientContext value={octokit}>{children}</GitHubClientContext>
    );
}

export function useGitHubClient() {
    const ctx = use(GitHubClientContext);

    if (!ctx) {
        throw new Error(
            "useGitHubClient must be used within a GitHubClientProvider",
        );
    }

    return ctx;
}
