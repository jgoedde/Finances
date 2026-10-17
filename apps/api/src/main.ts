import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createApp } from "./app.ts";
import { createUser } from "./auth/auth.ts";
import { bootstrap } from "./bootstrap.ts";
import { staticRoutes } from "./http/static.ts";

const { db, auth } = await bootstrap();

// First start: create the initial admin from the environment.
const { count } = await db
    .selectFrom("user")
    .select((eb) => eb.fn.countAll<number>().as("count"))
    .executeTakeFirstOrThrow();
if (count === 0) {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    if (username && password) {
        await createUser(auth, {
            username: username.toLowerCase(),
            password,
            role: "admin",
        });
        console.log(`Created admin user "${username}"`);
    } else {
        console.warn(
            "No users exist. Set ADMIN_USERNAME and ADMIN_PASSWORD to create the first admin.",
        );
    }
}

const server = new Hono()
    .route("/", createApp(db, auth))
    .all("/api/*", (c) => c.json({ error: "not_found" }, 404));

// In production the API also serves the built client (same origin).
const staticDir = process.env.STATIC_DIR;
if (staticDir) {
    server.route("/", staticRoutes(staticDir));
}

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: server.fetch, port }, () => {
    console.log(`Listening on http://localhost:${port}`);
});
