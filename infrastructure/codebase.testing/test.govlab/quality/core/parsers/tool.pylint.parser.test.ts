import { describe, expect, it } from "vitest";
import { parsePylintOutput } from "@govlab/quality/core/parsers/tool.pylint.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED =
    '[{"column":0,"line":1,"message":"Missing module docstring","message-id":"C0114","path":"bad.py","symbol":"missing-module-docstring","type":"convention"},' +
    '{"column":0,"line":4,"message":"Too many arguments (6/5)","message-id":"R0913","path":"bad.py","symbol":"too-many-arguments","type":"refactor"}]';

describe("parsePylintOutput", () => {
    it("maps each message to a gating (advisory:false) error finding keyed by symbol, 1-basing the column", () => {
        const findings = parsePylintOutput(RECORDED, "python", false);
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 1,
            ecosystem: "python",
            file: "bad.py",
            line: 1,
            ruleId: "missing-module-docstring",
            severity: "error",
            tool: "pylint",
        });
        expect(findings[1]).toMatchObject({ advisory: false, ruleId: "too-many-arguments", severity: "error" });
    });

    it("marks every finding advisory (non-gating) but still an error when pylint runs unelected", () => {
        const findings = parsePylintOutput(RECORDED, "python", true);
        expect(findings.every((finding) => finding.advisory && finding.severity === "error")).toBe(true);
    });

    it("returns [] on empty or non-array output", () => {
        expect(parsePylintOutput("", "python", false)).toEqual([]);
        expect(parsePylintOutput("[]", "python", false)).toEqual([]);
        expect(parsePylintOutput("not json", "python", false)).toEqual([]);
    });
});
