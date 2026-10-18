import { createFactory } from "hono/factory";
import type { AppEnv } from "./session.ts";

/**
 * Builds endpoints: `factory.createHandlers(...validators, handler)`, one
 * per file, mounted by the feature's `routes.ts`.
 */
export const factory = createFactory<AppEnv>();
