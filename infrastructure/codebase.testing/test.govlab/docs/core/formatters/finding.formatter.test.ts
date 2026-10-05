import {
    conventionFix,
    describeFindings,
    expectedText,
    formatFinding,
    summaryLine,
} from "@govlab/docs/core/formatters/finding.formatter.ts";
import { describe, expect, it } from "vitest";

describe("expectedText and conventionFix", () => {
    it("render a hint only when an expected value is present, and a fix per convention code", () => {
        expect(expectedText({})).toBe("");
        expect(expectedText({ expected: "x" })).toBe(' → expected "x"');
        expect(conventionFix("bare-path", "a/b.ts")).toContain("`a/b.ts`");
        expect(conventionFix("untagged-code-fence", "")).toContain("must declare a language");
        expect(conventionFix("unlabeled-fence", "ts")).toContain("a ts fence");
    });
});

describe("describeFindings and formatFinding", () => {
    it("type every category's hit with its code, position and text in report order", () => {
        const described = describeFindings({
            broken: [{ col: 4, line: 9, path: "gone.md" }],
            location: [{ code: "off-location", detail: "wrong folder", expected: "elsewhere" }],
            smell: [{ col: 2, line: 3, term: "formerly" }],
            spine: [{ detail: "no title", line: 1 }],
        });
        expect(described.map((finding) => finding.code)).toStrictEqual([
            "spine",
            "off-location",
            "broken-path",
            "history-smell",
        ]);
        expect(described[1]?.text).toBe('wrong folder → expected "elsewhere"');
        expect(described[2]).toMatchObject({ col: 4, line: 9, text: '"gone.md" does not exist' });
        expect(formatFinding({ category: "spine", code: "spine", col: 1, line: 1, text: "no title" }, "a.md")).toBe(
            "✖ a.md:1:1 [spine] no title",
        );
    });
});

describe("summaryLine", () => {
    it("names the scanned and failing document totals", () => {
        const line = summaryLine(4, 1, { broken: 2 });
        expect(line).toContain("scanned 4 document(s)");
        expect(line).toContain("across 1 doc(s)");
    });
});
