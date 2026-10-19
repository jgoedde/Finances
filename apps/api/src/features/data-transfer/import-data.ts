import { bodyLimit } from "hono/body-limit";
import { dataImportSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { logger } from "#/log.ts";
import {
    hasData,
    InvalidReferenceError,
    replaceData,
} from "#/features/data-transfer/data-transfer.ts";

const MAX_IMPORT_BYTES = 50 * 1024 * 1024;

/**
 * Body: an export. An account with data is only replaced with
 * `?replace=true`.
 */
export const importData = factory.createHandlers(
    bodyLimit({
        maxSize: MAX_IMPORT_BYTES,
        onError: (c) => c.json({ error: "file_too_large" }, 413),
    }),
    validate("json", dataImportSchema),
    async (c) => {
        const { db, userId } = c.var;
        const replace = c.req.query("replace") === "true";
        if (!replace && (await hasData(db, userId))) {
            return c.json({ error: "account_not_empty" }, 409);
        }

        try {
            const result = await replaceData(db, userId, c.req.valid("json"));
            logger.info({ userId, replace, ...result }, "Data imported");
            return c.json(result);
        } catch (error) {
            if (error instanceof InvalidReferenceError) {
                logger.warn({ userId }, "Import rejected: unknown category");
                return c.json({ error: "unknown_category" }, 422);
            }
            throw error;
        }
    },
);
