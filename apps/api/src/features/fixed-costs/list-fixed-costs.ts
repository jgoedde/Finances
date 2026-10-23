import { factory } from "#/http/factory.ts";
import { loadFixedCosts } from "#/features/fixed-costs/fixed-costs.ts";

export const listFixedCosts = factory.createHandlers(async (c) =>
    c.json(await loadFixedCosts(c.var.db, c.var.userId)),
);
