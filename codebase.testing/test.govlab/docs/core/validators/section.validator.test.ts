import { describe, expect, it } from "vitest";
import { offSchema } from "@govlab/docs/core/validators/section.validator.ts";

const schema = {
    metaConcerns: [
        { concern: "Purpose", order: 1, required: true },
        { concern: "API", order: 2, required: true },
        { concern: "Notes", order: 3, required: false },
    ],
    type: "readme",
};

describe("offSchema", () => {
    it("reports a missing required section", () => {
        const defects = offSchema("## Purpose\n\nx\n", schema);
        expect(defects.map((defect) => defect.concern)).toStrictEqual(["API"]);
        expect(defects[0]?.remediation).toContain("Missing required section");
    });

    it("reports required sections out of order", () => {
        const defects = offSchema("## API\n\nx\n\n## Purpose\n\ny\n", schema);
        expect(defects.some((defect) => defect.concern === "API" && defect.remediation.includes("out of order"))).toBe(
            true,
        );
    });

    it("accepts reordered sections when the schema is unordered, and an alias for a section", () => {
        const unordered = { ...schema, ordered: false };
        expect(offSchema("## API\n\nx\n\n## Purpose\n\ny\n", unordered)).toStrictEqual([]);
        const aliased = {
            metaConcerns: [
                { aliases: ["What is it"], concern: "Purpose", order: 1, required: true },
                { concern: "API", order: 2, required: true },
            ],
            type: "readme",
        };
        expect(offSchema("## What is it\n\nx\n\n## API\n\ny\n", aliased)).toStrictEqual([]);
        expect(offSchema("## What is it\n\nx\n", aliased).map((defect) => defect.concern)).toStrictEqual(["API"]);
    });
});
