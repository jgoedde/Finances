import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

function cacheControl(path: string): string {
    // Vite puts content-hashed files under /assets.
    if (path.includes("/assets/")) {
        return "public, max-age=31536000, immutable";
    }
    if (/\.(?:png|ico|jpg|svg|webmanifest)$/.test(path)) {
        return "public, max-age=86400";
    }
    // index.html, sw.js, registerSW.js, workbox-*.js: always revalidate.
    return "no-cache";
}

/** Serves the built client, falling back to index.html for SPA routes. */
export function staticRoutes(root: string) {
    const onFound = (
        path: string,
        c: { header: (k: string, v: string) => void },
    ) => c.header("Cache-Control", cacheControl(path));
    return new Hono()
        .use("*", serveStatic({ root, onFound }))
        .get("*", serveStatic({ root, path: "index.html", onFound }));
}
