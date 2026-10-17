// Shared defaults. A workspace that needs more (e.g. plugins) has its own
// prettier.config.js that spreads this one: Prettier uses only the nearest
// config and doesn't merge them.

/** @type {import("prettier").Config} */
export default {
    tabWidth: 4,
};
