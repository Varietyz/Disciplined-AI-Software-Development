import { CORE_FIELDS, generateModuleDoc } from "@govlab/docs/core/formatters/readme.formatter.ts";
import { describe, expect, it } from "vitest";
import { README_CONTEXT } from "./readme.fixture.ts";

describe("generateModuleDoc", () => {
    it("renders every core layer in order, a custom field as its own layer and the metrics footer", () => {
        const readme = generateModuleDoc(README_CONTEXT);
        const order = [
            "# @govlab/mod",
            "## Purpose",
            "## When to use",
            "## Install",
            "## Quick start",
            "## API",
            "## Configuration",
        ];
        const positions = order.map((heading) => readme.indexOf(heading));
        expect(positions.every((position) => position >= 0)).toBe(true);
        expect(positions).toStrictEqual(positions.toSorted((left, right) => left - right));
        expect(readme).toContain("## The Extra\n\nExtra section.");
        expect(readme).toContain("<!-- concern:metrics -->");
        expect(readme).not.toContain("## Architecture charts");
        expect(CORE_FIELDS.has("the-extra")).toBe(false);
    });
});
