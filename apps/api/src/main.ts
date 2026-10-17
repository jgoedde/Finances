import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createApp } from "./app.ts";
import { createUser } from "./auth/auth.ts";
import { bootstrap } from "./bootstrap.ts";
import { requestLogger } from "./http/request-logger.ts";
import { staticRoutes } from "./http/static.ts";
import { logger } from "./log.ts";

process.on("uncaughtException", (error) => {
    logger.fatal({ err: error }, "Uncaught exception");
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    logger.fatal({ err: reason }, "Unhandled rejection");
    process.exit(1);
});

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
        logger.info({ username }, "Created admin user");
    } else {
        logger.warn(
            "No users exist. Set ADMIN_USERNAME and ADMIN_PASSWORD to create the first admin.",
        );
    }
}

const server = new Hono()
    .use("/api/*", requestLogger(logger))
    .route("/", createApp(db, auth))
    .all("/api/*", (c) => c.json({ error: "not_found" }, 404));

// In production the API also serves the built client (same origin).
const staticDir = process.env.STATIC_DIR;
if (staticDir) {
    server.route("/", staticRoutes(staticDir));
    logger.info({ staticDir }, "Serving the client");
}

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: server.fetch, port }, () => {
    logger.info(`Listening on http://localhost:${port}`);
});
