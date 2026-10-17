import { validator } from "hono/validator";
import type { z } from "zod";

/** Validates a request part with a zod schema; responds 400 on failure. */
export function validate<T extends z.ZodType>(
    target: "json" | "query" | "param",
    schema: T,
) {
    return validator(target, (value, c) => {
        const result = schema.safeParse(value);
        if (!result.success) {
            return c.json(
                { error: "invalid_request", issues: result.error.issues },
                400,
            );
        }
        return result.data;
    });
}
