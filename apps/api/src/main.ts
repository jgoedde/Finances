import { serve } from "@hono/node-server";
import { createApp } from "./app.ts";
import { authOptions, createAuth, createUser } from "./auth/auth.ts";
import { openDatabase } from "./db/database.ts";
import { migrate } from "./db/migrate.ts";

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable ${name}`);
    }
    return value;
}

const db = openDatabase(process.env.DATABASE_PATH ?? "/data/finances.db");
const authConfig = {
    secret: requireEnv("BETTER_AUTH_SECRET"),
    baseURL: requireEnv("BASE_URL"),
};

await migrate(db, authOptions(db, authConfig));
const auth = createAuth(db, authConfig);

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

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: createApp(db, auth).fetch, port }, () => {
    console.log(`API listening on http://localhost:${port}`);
});
