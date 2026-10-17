import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

// Shared defaults. Each workspace has its own eslint.config.js that extends
// this one; `npm run lint` lints every workspace.
export default defineConfig(
    {
        ignores: [
            "**/dist",
            "**/dev-dist",
            "**/coverage",
            "**/routeTree.gen.ts",
        ],
    },
    {
        files: ["**/*.{js,ts,tsx}"],
        extends: [js.configs.recommended, tseslint.configs.recommended],
    },
);
