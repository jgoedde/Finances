import { bodyLimit } from "hono/body-limit";
import { z } from "zod";
import { dataImportSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { logger } from "#/log.ts";
import {
    CategoryKindMismatchError,
    hasData,
    InvalidReferenceError,
    PriceChangeOutOfRangeError,
    replaceData,
} from "#/features/data-transfer/data-transfer.ts";

const MAX_IMPORT_BYTES = 50 * 1024 * 1024;

// Anything but `true` keeps the account's data (no strict boolean).
const importQuerySchema = z.object({ replace: z.string().optional() });

/**
 * Body: an export. An account with data is only replaced with
 * `?replace=true`.
 */
export const importData = factory.createHandlers(
    bodyLimit({
        maxSize: MAX_IMPORT_BYTES,
        onError: (c) => c.json({ error: "file_too_large" as const }, 413),
    }),
    validate("query", importQuerySchema),
    validate("json", dataImportSchema),
    async (c) => {
        const { db, userId } = c.var;
        const replace = c.req.valid("query").replace === "true";
        if (!replace && (await hasData(db, userId))) {
            return c.json({ error: "account_not_empty" as const }, 409);
        }

        try {
            const result = await replaceData(db, userId, c.req.valid("json"));
            logger.info({ userId, replace, ...result }, "Data imported");
            return c.json(result);
        } catch (error) {
            if (error instanceof InvalidReferenceError) {
                logger.warn({ userId }, "Import rejected: unknown category");
                return c.json({ error: "unknown_category" as const }, 422);
            }
            if (error instanceof CategoryKindMismatchError) {
                logger.warn(
                    { userId },
                    "Import rejected: category of the other kind",
                );
                return c.json(
                    { error: "category_kind_mismatch" as const },
                    422,
                );
            }
            if (error instanceof PriceChangeOutOfRangeError) {
                logger.warn(
                    { userId },
                    "Import rejected: price change out of range",
                );
                return c.json(
                    { error: "price_change_out_of_range" as const },
                    422,
                );
            }
            throw error;
        }
    },
);
