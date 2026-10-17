import { z } from "zod";

export const fixedCostCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
});
export type FixedCostCategory = z.infer<typeof fixedCostCategorySchema>;

export const fixedCostIntervalSchema = z.enum([
    "monthly",
    "quarterly",
    "yearly",
]);
export type FixedCostInterval = z.infer<typeof fixedCostIntervalSchema>;

/** Calendar date as `YYYY-MM-DD`. */
const isoDate = z.iso.date();

export const fixedCostInputSchema = z.object({
    name: z.string().trim().min(1).max(200),
    description: z.string().max(2000).nullable(),
    amount: z.number().nonnegative().finite(),
    currency: z.string().length(3),
    interval: fixedCostIntervalSchema,
    categoryId: z.string().min(1),
    active: z.boolean(),
    startDate: isoDate,
    endDate: isoDate.nullable(),
});
export type FixedCostInput = z.infer<typeof fixedCostInputSchema>;

export const fixedCostPatchSchema = fixedCostInputSchema.partial();
export type FixedCostPatch = z.infer<typeof fixedCostPatchSchema>;

export const fixedCostSchema = fixedCostInputSchema.extend({
    id: z.string(),
});
export type FixedCost = z.infer<typeof fixedCostSchema>;
