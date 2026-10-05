import { describe, expect, it } from "vitest";
import { parseReviveOutput } from "@govlab/quality/core/parsers/tool.revive.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED =
    '[{"Failure":"function Complex has cognitive complexity 15 (> max enabled 3)","Position":{"Start":{"Column":1,"Filename":"bad.go","Line":3}},"RuleName":"cognitive-complexity","Severity":"warning"},' +
    '{"Failure":"maximum number of arguments per function exceeded; max 2 but got 3","Position":{"Start":{"Column":1,"Filename":"bad.go","Line":3}},"RuleName":"argument-limit","Severity":"error"}]';

describe("parseReviveOutput", () => {
    it("maps each failure to a gating (advisory:false) error finding keyed by RuleName when elected", () => {
        const findings = parseReviveOutput(RECORDED, "go", false);
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 1,
            ecosystem: "go",
            file: "bad.go",
            line: 3,
            ruleId: "cognitive-complexity",
            severity: "error",
            tool: "revive",
        });
        expect(findings[1]).toMatchObject({ advisory: false, ruleId: "argument-limit", severity: "error" });
    });

    it("marks every finding advisory (non-gating) but still an error when revive runs unelected", () => {
        const findings = parseReviveOutput(RECORDED, "go", true);
        expect(findings.every((finding) => finding.advisory && finding.severity === "error")).toBe(true);
    });

    it("returns [] on empty or non-array output", () => {
        expect(parseReviveOutput("", "go", false)).toEqual([]);
        expect(parseReviveOutput("[]", "go", false)).toEqual([]);
        expect(parseReviveOutput("not json", "go", false)).toEqual([]);
    });
});
