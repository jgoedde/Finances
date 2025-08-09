import { useLocalStorage } from "@mantine/hooks";
import type { GitHubConfig } from "@/routes/setup.tsx";

export function useGitHubConfig() {
    return useLocalStorage<GitHubConfig>({
        key: "finances-login",
        getInitialValueInEffect: false,
        defaultValue: { gistName: "my-finances.enc" },
    });
}
