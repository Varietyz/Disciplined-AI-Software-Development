import {
    BODILESS_ALTERNATE,
    EMPTY_PAYLOAD,
    MALFORMED_PAYLOAD,
    MISSING_PAGE_ERROR,
    inlineTag,
    unanchoredAlternate,
    untitledAlternate,
    wrongPayloadId,
    wrongPayloadTab,
} from "@banes-lab/build-scripts/configuration/strings/payload.strings.ts";
import { describe, expect, it } from "vitest";

describe("the payload findings", () => {
    it("name the tag, the id, the tab, the title or the address each finding is about", () => {
        expect(
            [MISSING_PAGE_ERROR, EMPTY_PAYLOAD, MALFORMED_PAYLOAD, BODILESS_ALTERNATE].every((text) =>
                text.endsWith("."),
            ),
        ).toBe(true);
        expect(inlineTag("em")).toContain("inline <em> tag");
        expect(wrongPayloadId("home", "terms")).toBe("The payload id is home, expected terms.");
        expect(wrongPayloadTab("guide")).toBe("The payload tab is not guide.");
        expect(untitledAlternate("Terms")).toContain('page title "Terms"');
        expect(unanchoredAlternate("https://x.test/terms")).toContain("canonical address https://x.test/terms");
    });
});
