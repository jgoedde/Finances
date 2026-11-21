import { bodyLimit } from "hono/body-limit";
import { dataImportQuerySchema, dataImportSchema } from "@finances/shared";
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
import { apiError } from "#/http/api-error.ts";

const MAX_IMPORT_BYTES = 50 * 1024 * 1024;

/**
 * Body: an export. An account with data is only replaced with
 * `?replace=true`.
 */
export const importData = factory.createHandlers(
    bodyLimit({
        maxSize: MAX_IMPORT_BYTES,
        onError: (c) => apiError(c, "file_too_large", 413),
    }),
    validate("query", dataImportQuerySchema),
    validate("json", dataImportSchema),
    async (c) => {
        const { db, userId } = c.var;
        const { replace } = c.req.valid("query");
        if (!replace && (await hasData(db, userId))) {
            return apiError(c, "account_not_empty", 409);
        }

        try {
            const result = await replaceData(db, userId, c.req.valid("json"));
            logger.info({ userId, replace, ...result }, "Data imported");
            return c.json(result);
        } catch (error) {
            if (error instanceof InvalidReferenceError) {
                logger.warn({ userId }, "Import rejected: unknown category");
                return apiError(c, "unknown_category", 422);
            }
            if (error instanceof CategoryKindMismatchError) {
                logger.warn(
                    { userId },
                    "Import rejected: category of the other kind",
                );
                return apiError(c, "category_kind_mismatch", 422);
            }
            if (error instanceof PriceChangeOutOfRangeError) {
                logger.warn(
                    { userId },
                    "Import rejected: price change out of range",
                );
                return apiError(c, "price_change_out_of_range", 422);
            }
            throw error;
        }
    },
);
