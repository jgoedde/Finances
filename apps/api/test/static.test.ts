import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { staticRoutes } from "#/http/static.ts";

describe("static client files", () => {
    let root: string;

    beforeEach(() => {
        root = mkdtempSync(join(tmpdir(), "finances-static-"));
        writeFileSync(join(root, "index.html"), "<!doctype html>");
        writeFileSync(join(root, "site.webmanifest"), "{}");
        writeFileSync(join(root, "favicon-32x32.png"), "");
    });

    afterEach(() => {
        rmSync(root, { recursive: true, force: true });
    });

    async function cacheControl(path: string) {
        const response = await staticRoutes(root).request(path);
        expect(response.status).toBe(200);
        return response.headers.get("Cache-Control");
    }

    it("revalidates the web app manifest on every load", async () => {
        expect(await cacheControl("/site.webmanifest")).toBe("no-cache");
    });

    it("caches images for a day", async () => {
        expect(await cacheControl("/favicon-32x32.png")).toBe(
            "public, max-age=86400",
        );
    });

    it("revalidates the SPA shell", async () => {
        expect(await cacheControl("/index.html")).toBe("no-cache");
    });

    it("revalidates the SPA shell served for unknown paths", async () => {
        expect(await cacheControl("/transactions")).toBe("no-cache");
        expect(await cacheControl("/missing.png")).toBe("no-cache");
    });
});
