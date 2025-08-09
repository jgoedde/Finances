import { createContext, type PropsWithChildren, use, useMemo } from "react";
import { Octokit } from "@octokit/rest";
import { useGitHubConfig } from "@/hooks/useGitHubConfig.ts";

const GitHubClientContext = createContext<Octokit | undefined>(undefined);

export function GitHubClientProvider({ children }: PropsWithChildren) {
    const [gitHubConfig] = useGitHubConfig();

    const octokit = useMemo(() => {
        return new Octokit({
            auth: gitHubConfig?.pat,
        });
    }, [gitHubConfig?.pat]);

    return (
        <GitHubClientContext value={octokit}>{children}</GitHubClientContext>
    );
}

export type GitHubClient = ReturnType<typeof useGitHubClient>;

export function useGitHubClient() {
    const ctx = use(GitHubClientContext);

    if (!ctx) {
        throw new Error(
            "useGitHubClient must be used within a GitHubClientProvider",
        );
    }

    return ctx;
}
