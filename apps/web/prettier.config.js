import base from "../../prettier.config.js";

/** @type {import("prettier").Config} */
export default {
    ...base,
    plugins: [
        "prettier-plugin-tailwindcss",
        "prettier-plugin-classnames",
        "prettier-plugin-merge",
    ],
};
