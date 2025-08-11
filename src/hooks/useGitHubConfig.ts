import type { GitHubConfig } from "@/routes/setup.tsx";

export function useGitHubConfig(): [
    GitHubConfig,
    (val: GitHubConfig | ((prevState: GitHubConfig) => GitHubConfig)) => void,
] {
    return [{ gistName: "nigga.enc" } as GitHubConfig, (_newVar) => _newVar];
}
