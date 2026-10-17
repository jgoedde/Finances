import { type BetterAuthOptions, betterAuth } from "better-auth";
import { admin, username } from "better-auth/plugins";
import type { DB } from "../db/database.ts";
import { seedUserData } from "../db/seed.ts";
import { logger } from "../log.ts";

const DAY_SECONDS = 60 * 60 * 24;

export interface AuthConfig {
    secret: string;
    /** Public URL of the app, e.g. `https://finances.example.com`. */
    baseURL: string;
    /** Extra origins allowed to call auth endpoints, e.g. a LAN address. */
    trustedOrigins?: string[];
}

export function authOptions(db: DB, config: AuthConfig) {
    return {
        database: { db, type: "sqlite" },
        secret: config.secret,
        baseURL: config.baseURL,
        trustedOrigins: config.trustedOrigins ?? [],
        basePath: "/api/auth",
        emailAndPassword: {
            enabled: true,
            // Users only come into existence through invites or the admin
            // bootstrap, both of which create them server-side.
            disableSignUp: true,
            minPasswordLength: 8,
        },
        session: {
            // A PWA may stay offline for days; keep sessions alive long.
            expiresIn: 90 * DAY_SECONDS,
            updateAge: DAY_SECONDS,
        },
        advanced: {
            defaultCookieAttributes: { sameSite: "strict" },
        },
        plugins: [username(), admin()],
        // Only the message and an error: other arguments may carry request
        // data such as credentials.
        logger: {
            log: (level, message, ...args) => {
                const err = args.find((arg) => arg instanceof Error);
                logger[level]({ component: "better-auth", err }, message);
            },
        },
        databaseHooks: {
            user: {
                create: {
                    after: async (user) => {
                        await seedUserData(db, user.id);
                        logger.info({ userId: user.id }, "User created");
                    },
                },
            },
            session: {
                create: {
                    after: async (session) => {
                        logger.info({ userId: session.userId }, "Signed in");
                    },
                },
            },
        },
    } satisfies BetterAuthOptions;
}

/** Run `migrate` with the same options first: better-auth checks its schema on creation. */
export function createAuth(db: DB, config: AuthConfig) {
    return betterAuth(authOptions(db, config));
}

export type Auth = ReturnType<typeof createAuth>;

/**
 * Creates a user without a session (server-side). better-auth requires an
 * email, so a non-routable placeholder derived from the username is stored.
 */
export async function createUser(
    auth: Auth,
    input: { username: string; password: string; role?: "admin" | "user" },
) {
    const { user } = await auth.api.createUser({
        body: {
            email: `${input.username}@users.invalid`,
            password: input.password,
            name: input.username,
            role: input.role ?? "user",
            data: { username: input.username, displayUsername: input.username },
        },
    });
    return user;
}

/** Replaces a user's password and signs them out everywhere. */
export async function resetPassword(
    auth: Auth,
    userId: string,
    password: string,
): Promise<void> {
    const ctx = await auth.$context;
    const hash = await ctx.password.hash(password);
    await ctx.internalAdapter.updatePassword(userId, hash);
    await ctx.internalAdapter.deleteUserSessions(userId);
    logger.info({ userId }, "Password reset, sessions revoked");
}
