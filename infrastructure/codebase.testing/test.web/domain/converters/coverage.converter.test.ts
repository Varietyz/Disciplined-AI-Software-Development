import { describe, expect, it } from "vitest";
import { coverageRow } from "@banes-lab/web/domain/converters/coverage.converter.ts";

describe("coverageRow", () => {
    it("counts every question of a collection and names its declared absences", () => {
        const entry = coverageRow({
            collection: "architecture",
            questions: [
                { answered: 3, declaredAbsent: 0, question: "evidence" },
                { answered: 4, declaredAbsent: 1, question: "authority" },
            ],
            records: 4,
        });
        expect(entry.term).toBe("Principles");
        expect(entry.description).toContain("evidence");
        expect(entry.description).toContain("authoritative side");
        expect(entry.description).toContain("1 ");
    });

    it("refuses a question it carries no label for", () => {
        expect(() =>
            coverageRow({
                collection: "architecture",
                questions: [{ answered: 1, declaredAbsent: 0, question: "ghost" }],
                records: 1,
            }),
        ).toThrow('"ghost"');
    });
});
