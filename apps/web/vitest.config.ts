import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

// Component tests in a DOM, with the app's plugins (the Paraglide plugin
// compiles the messages into src/paraglide first).
export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: "jsdom",
            setupFiles: ["./test/setup.ts"],
        },
    }),
);
