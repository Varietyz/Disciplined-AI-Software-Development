import {
    REFERENCES_CLEAN,
    UNDECLARED_HIDDEN,
    closedValuesLine,
    constructGroupLine,
    emptyScope,
    fieldReachLine,
    missingRoot,
    noClosedScope,
    plainClosedValue,
    referenceLine,
    referencesFailed,
    unreadCarrier,
    unreadField,
} from "@ssot/govlab/codemods/strings/validation.strings.ts";
import { describe, expect, it } from "vitest";

describe("the path reference lines", () => {
    it("report a clean run, or the count and each literal location", () => {
        expect(REFERENCES_CLEAN.startsWith("path-references: clean.")).toBe(true);
        expect(referencesFailed(2)).toContain("FAILED: 2 literal workspace location(s)");
        expect(constructGroupLine("title", 2)).toBe("  title (2)\n");
        expect(referenceLine("a.ts", "x/y", "x")).toBe("    a.ts  \"x/y\"  names 'x'\n");
    });
});

describe("the field and closed value lines", () => {
    it("count what each scope reads and name every field or value that needs a repair", () => {
        const counts = { carried: 1, fields: 5, hidden: 1, read: 2, unread: 1 };
        expect(fieldReachLine("site", counts)).toContain(
            "site: 5 field(s), 2 read, 1 carried, 1 declared hidden, 1 unread",
        );
        expect(emptyScope("site")).toContain("site: the scope holds no fields");
        expect(missingRoot("a.ts", "site", "Page")).toContain('the scope "site" names the root Page');
        expect(unreadField("a.ts:1", "title", "site", UNDECLARED_HIDDEN)).toContain("title is never read by the site");
        expect(unreadCarrier("meta")).toContain("its carrier meta is never read");
        expect(noClosedScope("closed")).toContain('no scope labeled "closed"');
        expect(closedValuesLine(3, 1, 2)).toContain("3 closed-vocabulary value(s)");
        expect(plainClosedValue("a.ts:1", "maturity", "status")).toContain("a value of maturity reaches status");
    });
});
