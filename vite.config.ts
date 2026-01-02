import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
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
            includeAssets: ["favicon.ico", "apple-touch-icon.png"],
            registerType: "autoUpdate",
            manifest: {
                name: "Finances",
                short_name: "Finances",
                description: "Behalte deine persönlichen Finanzen im Blick",
                theme_color: "#004BAC",
                icons: [
                    {
                        src: "/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },

            workbox: {
                globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                disableDevLogs: true,
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
        __APP_ENV__: JSON.stringify(
            process.env.VITE_VERCEL_ENV || "development",
        ),
        __APP_COMMIT_HASH__: JSON.stringify(
            process.env.VITE_VERCEL_GIT_COMMIT_SHA,
        ),
    },
});
