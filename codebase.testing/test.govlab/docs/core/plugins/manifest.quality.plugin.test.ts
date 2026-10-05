import { describe, expect, it } from "vitest";
import { isPlainRecord } from "@govlab/docs/core/predicates/record.predicate.ts";
import { plugin } from "@govlab/docs/core/plugins/manifest.quality.plugin.ts";

const KNOWN_CONCEPT = "content-strings";

const errorsOf = function errorsOf(record: Record<string, unknown>): string[] {
    return isPlainRecord(record) ? (plugin.section?.validate?.(record) ?? []) : [];
};

describe("the quality manifest plugin", () => {
    it("validates governedBy against the canonical concepts", () => {
        expect(errorsOf({ governedBy: [KNOWN_CONCEPT, "csp"] })).toStrictEqual([]);
        expect(errorsOf({})).toStrictEqual([]);
        expect(
            errorsOf({ governedBy: [KNOWN_CONCEPT, "not-a-concept"] }).some((error) => error.includes("not-a-concept")),
        ).toBe(true);
        expect(errorsOf({ governedBy: KNOWN_CONCEPT }).some((error) => error.includes("array"))).toBe(true);
        expect(plugin.section?.keys).toStrictEqual(["governedBy"]);
    });

    it("contributes a declared governedBy and leaves an undeclared module without one", () => {
        const entry = { category: null, value: "x" };
        plugin.contribute?.({ governedBy: [KNOWN_CONCEPT] }, entry);
        expect(entry).toHaveProperty("governedBy", [KNOWN_CONCEPT]);
        const empty = { category: null, value: "x" };
        plugin.contribute?.({}, empty);
        expect(empty).not.toHaveProperty("governedBy");
    });
});
