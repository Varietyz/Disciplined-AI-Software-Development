import { describe, expect, it } from "vitest";
import { parseHadolintOutput } from "@govlab/quality/core/parsers/tool.hadolint.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify([
    {
        code: "DL3006",
        column: 1,
        file: "Dockerfile",
        level: "warning",
        line: 2,
        message: "Always tag the version of an image explicitly",
    },
    {
        code: "DL3008",
        column: 1,
        file: "Dockerfile",
        level: "warning",
        line: 3,
        message: "Pin versions in apt get install.",
    },
]);

describe("parseHadolintOutput", () => {
    it("maps comments to gating (error, advisory:false) Findings keyed by DL code", () => {
        const findings = parseHadolintOutput(RECORDED, "dockerfile");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 1,
            ecosystem: "dockerfile",
            file: "Dockerfile",
            line: 2,
            ruleId: "DL3006",
            severity: "error",
            tool: "hadolint",
        });
        expect(findings[1]).toMatchObject({ line: 3, ruleId: "DL3008" });
    });

    it("returns [] on empty, no-comments, or non-JSON output", () => {
        expect(parseHadolintOutput("", "dockerfile")).toEqual([]);
        expect(parseHadolintOutput("[]", "dockerfile")).toEqual([]);
        expect(parseHadolintOutput("not json", "dockerfile")).toEqual([]);
    });
});
