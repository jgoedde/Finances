import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
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
                    "**/*.{js,css,html,ico,png,svg,webp,woff,woff2,json}",
                ],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                navigateFallback: "/index.html",
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    build: {
        sourcemap: true,
    },
});
