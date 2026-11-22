import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

function cacheControl(path: string): string {
    // Vite puts content-hashed files under /assets.
    if (path.includes("/assets/")) {
        return "public, max-age=31536000, immutable";
    }
    if (/\.(?:png|ico|jpg|svg|webp)$/.test(path)) {
        return "public, max-age=86400";
    }
    // index.html, site.webmanifest, sw.js, registerSW.js, workbox-*.js:
    // always revalidate.
    return "no-cache";
}

/**
 * Serves the built client, falling back to index.html for SPA routes.
 * Cache headers are set before serving, because `serveStatic` builds the
 * response before calling `onFound`, so headers set there are lost.
 */
export function staticRoutes(root: string) {
    return new Hono()
        .use("*", async (c, next) => {
            c.header("Cache-Control", cacheControl(c.req.path));
            await next();
        })
        .use("*", serveStatic({ root }))
        .get(
            "*",
            async (c, next) => {
                c.header("Cache-Control", "no-cache");
                await next();
            },
            serveStatic({ root, path: "index.html" }),
        );
}
