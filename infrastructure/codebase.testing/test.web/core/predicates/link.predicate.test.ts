import { describe, expect, it } from "vitest";
import { isGenericLabel } from "@banes-lab/web/core/predicates/link.predicate.ts";

describe("isGenericLabel", () => {
    it("recognizes link text that names nothing out of context, whatever its case and spacing", () => {
        expect(isGenericLabel("Start")).toBe(true);
        expect(isGenericLabel("  Read   more ")).toBe(true);
        expect(isGenericLabel("Start the methodology")).toBe(false);
    });
});
