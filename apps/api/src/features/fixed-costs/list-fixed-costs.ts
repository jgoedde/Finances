import { factory } from "#/http/factory.ts";
import { readFixedCosts } from "#/features/fixed-costs/fixed-costs.ts";

export const listFixedCosts = factory.createHandlers(async (c) =>
    c.json(await readFixedCosts(c.var.db, c.var.userId)),
);
