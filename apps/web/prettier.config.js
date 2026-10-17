import base from "../../prettier.config.js";

/** @type {import("prettier").Config} */
export default {
    ...base,
    // Lets the Tailwind plugin know the theme's custom classes
    // (text-body-large, bg-surface-container, …) when sorting.
    tailwindStylesheet: "./src/globals.css",
    plugins: [
        "prettier-plugin-tailwindcss",
        "prettier-plugin-classnames",
        "prettier-plugin-merge",
    ],
};
