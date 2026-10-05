import { describe, expect, it } from "vitest";
import { isLabeledItem } from "@banes-lab/content/core/normalizers/sentence.normalizer.ts";

describe("isLabeledItem", () => {
    it("accepts a bold label followed by a separator and refuses the rest", () => {
        expect(isLabeledItem("**Label** — explanation")).toBe(true);
        expect(isLabeledItem("**Label**: explanation")).toBe(true);
        expect(isLabeledItem("**Bold sentence** in prose")).toBe(false);
        expect(isLabeledItem("plain text")).toBe(false);
    });
});
