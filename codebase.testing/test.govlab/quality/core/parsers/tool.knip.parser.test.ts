import { describe, expect, it } from "vitest";
import { isUnusedFile, parseKnipOutput } from "@govlab/quality/core/parsers/tool.knip.parser.ts";
import { relativePath } from "@ssot/paths";

describe("parseKnipOutput", () => {
    it("reports an unused file and each unused item under its category", () => {
        const stdout = JSON.stringify({
            issues: [{ exports: [{ line: 4, name: "gone" }], file: "a.ts", files: ["a.ts"] }],
        });
        const findings = parseKnipOutput(stdout, "typescript");
        expect(findings.map((finding) => finding.ruleId)).toStrictEqual(["knip/files", "knip/exports"]);
        expect(findings[1]?.message).toBe("Unused export: gone");
        expect(parseKnipOutput("", "typescript")).toStrictEqual([]);
    });
});

describe("isUnusedFile", () => {
    it("is false for knip's empty per-issue files array (an empty array is truthy in JS)", () => {
        expect(isUnusedFile([])).toBe(false);
    });

    it("is true ONLY when the files array is populated (a genuinely unused file)", () => {
        expect(isUnusedFile([`${relativePath("app.member")}/dead.js`])).toBe(true);
    });

    it("falls back to boolean truthiness when files is not an array", () => {
        expect(isUnusedFile(true)).toBe(true);
        expect(isUnusedFile(false)).toBe(false);
        const absent: unknown = null;
        expect(isUnusedFile(absent)).toBe(false);
    });
});
