import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import tanstackRouter from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
        }),
        react(),
        tailwindcss(),
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
