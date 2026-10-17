import globals from "globals";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";
import base from "../../eslint.config.js";

export default defineConfig(base, {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
    },
    plugins: {
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
        "react-x": reactX,
        "react-dom": reactDom,
    },
    rules: {
        ...reactHooks.configs.recommended.rules,
        ...reactX.configs["recommended-typescript"].rules,
        ...reactDom.configs.recommended.rules,
        // TanStack Router navigates by throwing `redirect(...)`.
        "@typescript-eslint/only-throw-error": [
            "error",
            {
                allow: [
                    {
                        from: "package",
                        package: "@tanstack/router-core",
                        name: "Redirect",
                    },
                ],
            },
        ],
    },
});
