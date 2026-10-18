import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import rootPackage from "../../package.json" with { type: "json" };

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
        }),
        // Compiles messages/*.json into src/paraglide (committed, like the
        // route tree, so type checks and lint work without a build).
        paraglideVitePlugin({
            project: "./project.inlang",
            outdir: "./src/paraglide",
            // See src/i18n.ts.
            strategy: ["custom-device", "baseLocale"],
            outputStructure: "locale-modules",
            emitTsDeclarations: true,
            emitGitIgnore: false,
            emitPrettierIgnore: true,
            emitReadme: false,
        }),
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "prompt",
            manifest: false, // Manifest is shipped separately.
            includeAssets: [
                "favicon-16x16.png",
                "favicon-32x32.png",
                "apple-touch-icon.png",
            ],
            workbox: {
                globPatterns: [
                    "**/*.{js,css,html,ico,png,svg,webp,woff2,json}",
                ],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                navigateFallback: "/index.html",
                // API requests must reach the server, never the SPA shell.
                navigateFallbackDenylist: [/^\/api\//],
            },
        }),
    ],
    define: {
        __APP_VERSION__: JSON.stringify(rootPackage.version),
    },
    server: {
        // `npm run dev:api` serves the API; same origin as in production.
        proxy: { "/api": "http://localhost:3000" },
    },
    build: {
        sourcemap: true,
    },
});
