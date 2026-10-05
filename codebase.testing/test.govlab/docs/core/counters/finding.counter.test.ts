import { countFindings, sumCategories } from "@govlab/docs/core/counters/finding.counter.ts";
import { describe, expect, it } from "vitest";

describe("countFindings and sumCategories", () => {
    it("total an empty set to zero and sum each category across documents", () => {
        expect(countFindings({})).toBe(0);
        expect(countFindings({ broken: [{}, {}], spine: [{}] })).toBe(3);
        expect(Object.values(sumCategories([])).every((total) => total === 0)).toBe(true);
        const totals = sumCategories([
            { all: { broken: [{}] }, relDoc: "a.md" },
            { all: { broken: [{}], smell: [{}] }, relDoc: "b.md" },
        ]);
        expect(totals).toMatchObject({ broken: 2, smell: 1, spine: 0 });
    });
});
