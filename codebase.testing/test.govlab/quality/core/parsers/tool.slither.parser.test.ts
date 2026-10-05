import { describe, expect, it } from "vitest";
import { parseSlitherReport, slitherSucceeded } from "@govlab/quality/core/parsers/tool.slither.parser.ts";

describe("slitherSucceeded", () => {
    it("reads the success flag of a report and treats an empty report as a failure", () => {
        expect(slitherSucceeded(JSON.stringify({ success: true }))).toBe(true);
        expect(slitherSucceeded("")).toBe(false);
    });
});

const EXPECTED_COUNT = 2;

const RECORDED =
    '{"error":null,"results":{"detectors":[' +
    '{"check":"tx-origin","confidence":"Medium","description":"Bad.setOwner() uses tx.origin for authorization","elements":[{"source_mapping":{"filename_relative":"govlab-governance/polyglot/solidity/Bad.sol","lines":[7,8,9,10]}}],"impact":"Medium"},' +
    '{"check":"suicidal","confidence":"High","description":"Bad.kill() allows anyone to destruct the contract","elements":[{"source_mapping":{"filename_relative":"x.sol","lines":[12]}}],"impact":"High"}' +
    ']},"success":true}';

const NO_DETECTORS = '{"results":{"detectors":[]},"success":true}';

describe("parseSlitherReport", () => {
    it("maps each detector to an advisory (advisory:true) finding keyed by check, impact→severity", () => {
        const findings = parseSlitherReport(RECORDED, "solidity");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: true,
            ecosystem: "solidity",
            file: "govlab-governance/polyglot/solidity/Bad.sol",
            line: 7,
            ruleId: "tx-origin",
            severity: "error",
            tool: "slither",
        });
        expect(findings[1]).toMatchObject({ advisory: true, line: 12, ruleId: "suicidal", severity: "error" });
    });

    it("returns [] on empty, no-detectors, or non-JSON output", () => {
        expect(parseSlitherReport("", "solidity")).toEqual([]);
        expect(parseSlitherReport(NO_DETECTORS, "solidity")).toEqual([]);
        expect(parseSlitherReport("not json", "solidity")).toEqual([]);
    });
});
