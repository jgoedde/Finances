import { factory } from "#/http/factory.ts";
import { logger } from "#/log.ts";
import { readExport } from "#/features/data-transfer/data-transfer.ts";

/**
 * Downloads all of the user's data as a JSON file.
 */
export const exportData = factory.createHandlers(async (c) => {
    const data = await readExport(c.var.db, c.var.userId);
    logger.info(
        {
            userId: c.var.userId,
            transactions: data.transactions.length,
            fixedCosts: data.fixedCosts.length,
        },
        "Data exported",
    );
    const date = data.exportedAt.slice(0, 10);
    c.header(
        "Content-Disposition",
        `attachment; filename="finances-${date}.json"`,
    );
    return c.json(data);
});
