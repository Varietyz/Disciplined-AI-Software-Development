import { describe, expect, it } from "vitest";
import { parseDepcheckOutput } from "@govlab/quality/core/parsers/tool.depcheck.parser.ts";

const EXPECTED_COUNT = 3;
const THIRD = 2;

const RECORDED = JSON.stringify({
    dependencies: ["lodash"],
    devDependencies: ["eslint"],
    missing: { chalk: ["src/log.js"] },
});

describe("parseDepcheckOutput", () => {
    it("maps unused deps and missing deps to advisory (advisory:true) error findings on package.json", () => {
        const findings = parseDepcheckOutput(RECORDED, "javascript");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: true,
            ecosystem: "javascript",
            file: "package.json",
            ruleId: "unused-dependency",
            severity: "error",
            tool: "depcheck",
        });
        expect(findings[1]).toMatchObject({ ruleId: "unused-dependency" });
        expect(findings[THIRD]).toMatchObject({ ruleId: "missing-dependency" });
    });

    it("returns [] on empty or non-JSON output", () => {
        expect(parseDepcheckOutput("", "javascript")).toEqual([]);
        expect(parseDepcheckOutput(JSON.stringify({ dependencies: [], missing: {} }), "javascript")).toEqual([]);
        expect(parseDepcheckOutput("not json", "javascript")).toEqual([]);
    });
});
