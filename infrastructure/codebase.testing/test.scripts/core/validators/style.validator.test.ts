import {
    NO_UNUSED_SELECTORS,
    unusedHeading,
    unusedOverflow,
} from "@project/scripts/configuration/strings/style.strings.ts";
import { describe, expect, it } from "vitest";
import { SAMPLE_LIMIT } from "@project/scripts/configuration/constants/style.constants.ts";
import { styleVerdict } from "@project/scripts/core/validators/style.validator.ts";
import { unusedSelectors } from "@project/scripts/core/adapters/style.adapter.ts";

describe("styleVerdict", () => {
    it("holds with no unused selector, and samples a long list with a pointer to the report", () => {
        expect(styleVerdict([], "report.json")).toStrictEqual({ held: true, text: NO_UNUSED_SELECTORS });
        const unused = Array.from({ length: SAMPLE_LIMIT + 2 }, (_, index) => ({
            file: "a.css",
            selector: `.unused-${String(index)}`,
        }));
        const verdict = styleVerdict(unused, "report.json");
        expect(verdict.held).toBe(false);
        expect(verdict.text).toContain(unusedHeading(SAMPLE_LIMIT + 2));
        expect(verdict.text).toContain(unusedOverflow(2, "report.json"));
    });
});

describe("unusedSelectors", () => {
    it("reports every rejected selector with the stylesheet that declares it", async () => {
        const unused = await unusedSelectors();
        expect(unused.every((entry) => entry.selector.length > 0 && entry.file.length > 0)).toBe(true);
    }, 120_000);
});
