import { describe, expect, it } from "vitest";
import { dataImportQuerySchema } from "#/export.ts";
import { booleanQuery, toBooleanQuery } from "#/query.ts";

describe("toBooleanQuery", () => {
    it("encodes booleans the way booleanQuery decodes them", () => {
        expect(booleanQuery.parse(toBooleanQuery(true))).toBe(true);
        expect(booleanQuery.parse(toBooleanQuery(false))).toBe(false);
    });

    it("leaves a missing value out", () => {
        expect(toBooleanQuery(undefined)).toBeUndefined();
    });

    it("encodes the import's replace flag", () => {
        const parse = (replace: boolean | undefined) =>
            dataImportQuerySchema.parse({ replace: toBooleanQuery(replace) })
                .replace;
        expect(parse(true)).toBe(true);
        expect(parse(false)).toBe(false);
        expect(parse(undefined)).toBe(false);
    });
});
