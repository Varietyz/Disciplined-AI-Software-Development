import { describe, expect, it } from "vitest";
import { parseTsPruneOutput } from "@govlab/quality/core/parsers/tool.ts-prune.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = [
    "src/a.ts:3 - unusedExport",
    "src/b.ts:10 - alsoUnused",
    "src/c.ts:1 - reexported (used in module)",
].join("\n");

describe("parseTsPruneOutput", () => {
    it("maps each unused export to an advisory (advisory:true) error finding, skipping (used in module)", () => {
        const findings = parseTsPruneOutput(RECORDED, "typescript");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: true,
            ecosystem: "typescript",
            file: "src/a.ts",
            line: 3,
            ruleId: "unused-export",
            severity: "error",
            tool: "ts-prune",
        });
        expect(findings[1]).toMatchObject({ file: "src/b.ts", line: 10 });
    });

    it("returns [] on empty or unparseable output", () => {
        expect(parseTsPruneOutput("", "typescript")).toEqual([]);
        expect(parseTsPruneOutput("no separator", "typescript")).toEqual([]);
    });
});
