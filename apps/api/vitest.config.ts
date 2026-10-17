import { defineConfig } from "vitest/config";

export default defineConfig({
    // Tests that check logging pass their own logger.
    test: { env: { LOG_LEVEL: "silent" } },
});
