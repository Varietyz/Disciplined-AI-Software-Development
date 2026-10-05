import { describe, expect, it } from "vitest";
import { parseSwiftlintOutput } from "@govlab/quality/core/parsers/tool.swiftlint.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify([
    {
        character: 16,
        file: "govlab-governance/polyglot/swift/Bad.swift",
        line: 2,
        reason: "Force casts should be avoided.",
        rule_id: "force_cast",
        severity: "Error",
        type: "Force Cast",
    },
    {
        character: 1,
        file: "govlab-governance/polyglot/swift/Bad.swift",
        line: 5,
        reason: "Lines should not have trailing whitespace.",
        rule_id: "trailing_whitespace",
        severity: "Warning",
    },
]);

describe("parseSwiftlintOutput", () => {
    it("maps each violation to a gating (advisory:false) finding keyed by rule_id, severity mapped", () => {
        const findings = parseSwiftlintOutput(RECORDED, "swift");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 16,
            ecosystem: "swift",
            file: "govlab-governance/polyglot/swift/Bad.swift",
            line: 2,
            message: "Force casts should be avoided.",
            ruleId: "force_cast",
            severity: "error",
            tool: "swiftlint",
        });
        expect(findings[1]).toMatchObject({
            advisory: false,
            line: 5,
            ruleId: "trailing_whitespace",
            severity: "error",
        });
    });

    it("returns [] on empty, empty-array, or non-array/non-JSON output", () => {
        expect(parseSwiftlintOutput("", "swift")).toEqual([]);
        expect(parseSwiftlintOutput("[]", "swift")).toEqual([]);
        expect(parseSwiftlintOutput('{"not":"an array"}', "swift")).toEqual([]);
        expect(parseSwiftlintOutput("not json", "swift")).toEqual([]);
    });
});
