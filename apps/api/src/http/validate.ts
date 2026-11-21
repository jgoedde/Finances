import type { Context, MiddlewareHandler } from "hono";
import { validator } from "hono/validator";
import type { z } from "zod";
import type { AppEnv } from "./session.ts";

type Target = "json" | "query" | "param";

function invalidRequest(c: Context, issues: z.core.$ZodIssue[]) {
    return c.json({ error: "invalid_request" as const, issues }, 400);
}

/**
 * Validates a request part with a zod schema; responds 400 on failure.
 * Typed for the web client: it sends the schema's input and the handler
 * reads its output.
 */
export function validate<U extends Target, T extends z.ZodType>(
    target: U,
    schema: T,
) {
    const middleware = validator(target, (value, c) => {
        const result = schema.safeParse(value);
        if (!result.success) {
            return invalidRequest(c, result.error.issues);
        }
        return result.data;
    });
    // Hono's validator infers the input from the output (strings for query
    // and params), so state both sides from the schema.
    return middleware as unknown as MiddlewareHandler<
        AppEnv,
        string,
        { in: { [K in U]: z.input<T> }; out: { [K in U]: z.output<T> } },
        ReturnType<typeof invalidRequest>
    >;
}
