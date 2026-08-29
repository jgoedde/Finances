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
            registerType: "prompt", // you control when the update activates
            manifest: false, // you already ship site.webmanifest manually
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
                // Bump if you ever have large chunks/fonts that exceed the 2MB default
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
                navigateFallback: "/index.html",
            },
            devOptions: {
                enabled: true, // lets you test the SW in `vite dev` too
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
