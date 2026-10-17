import globals from "globals";
import { defineConfig } from "eslint/config";
import base from "../../eslint.config.js";

export default defineConfig(base, {
    languageOptions: {
        globals: globals.node,
    },
});
