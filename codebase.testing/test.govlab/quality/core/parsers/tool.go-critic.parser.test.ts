import { describe, expect, it } from "vitest";
import { parseGoCriticOutput } from "@govlab/quality/core/parsers/tool.go-critic.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = [
    "./crit.go:4:2: singleCaseSwitch: should rewrite switch statement to if statement",
    "./util.go:12:5: sloppyLen: len(xs) >= 1 can be len(xs) > 0",
].join("\n");

describe("parseGoCriticOutput", () => {
    it("maps each line to an advisory (advisory:true) error finding keyed by the check name", () => {
        const findings = parseGoCriticOutput(RECORDED, "go");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: true,
            column: 2,
            ecosystem: "go",
            file: "./crit.go",
            line: 4,
            ruleId: "singleCaseSwitch",
            severity: "error",
            tool: "go-critic",
        });
        expect(findings[1]).toMatchObject({ column: 5, line: 12, ruleId: "sloppyLen" });
    });

    it("returns [] on empty or unparseable lines", () => {
        expect(parseGoCriticOutput("", "go")).toEqual([]);
        expect(parseGoCriticOutput("no location here", "go")).toEqual([]);
    });
});
