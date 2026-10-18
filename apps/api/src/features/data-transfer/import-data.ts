import { bodyLimit } from "hono/body-limit";
import { dataExportSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { logger } from "#/log.ts";
import {
    hasData,
    InvalidReferenceError,
    parseUpload,
    replaceData,
} from "#/features/data-transfer/data-transfer.ts";

const MAX_IMPORT_BYTES = 50 * 1024 * 1024;

/**
 * Body: a JSON export or a legacy `.db` file, as raw bytes. An account with
 * data is only replaced with `?replace=true`.
 */
export const importData = factory.createHandlers(
    bodyLimit({
        maxSize: MAX_IMPORT_BYTES,
        onError: (c) => c.json({ error: "file_too_large" }, 413),
    }),
    async (c) => {
        const { db, userId } = c.var;
        const replace = c.req.query("replace") === "true";
        if (!replace && (await hasData(db, userId))) {
            return c.json({ error: "account_not_empty" }, 409);
        }

        let upload: unknown;
        try {
            upload = parseUpload(new Uint8Array(await c.req.arrayBuffer()));
        } catch (error) {
            logger.warn(
                { userId, err: error },
                "Import rejected: unreadable file",
            );
            return c.json({ error: "unreadable_file" }, 422);
        }

        const parsed = dataExportSchema.safeParse(upload);
        if (!parsed.success) {
            logger.warn(
                { userId, issues: parsed.error.issues.length },
                "Import rejected: invalid file",
            );
            return c.json(
                { error: "invalid_file", issues: parsed.error.issues },
                422,
            );
        }

        try {
            const result = await replaceData(db, userId, parsed.data);
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
