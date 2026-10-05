import { describe, expect, it } from "vitest";
import { parseLuacheckOutput } from "@govlab/quality/core/parsers/tool.luacheck.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = [
    "lua/bad.lua:1:16: (W211) unused function 'add'",
    "lua/bad.lua:2:11: (W211) unused variable 'unused'",
].join("\n");

describe("parseLuacheckOutput", () => {
    it("parses each plain line into an ADVISORY finding (advisory:true), reading line/col from the location tail", () => {
        const findings = parseLuacheckOutput(RECORDED, "lua");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings.every((finding) => finding.advisory)).toBe(true);
        expect(findings[1]).toMatchObject({
            advisory: true,
            column: 11,
            ecosystem: "lua",
            file: "lua/bad.lua",
            line: 2,
            ruleId: "W211",
            severity: "error",
            tool: "luacheck",
        });
    });

    it("keeps a Windows drive-letter prefix in the file path (split-on-colon takes the last two segments)", () => {
        const findings = parseLuacheckOutput(String.raw`C:\src\bad.lua:3:5: (E011) syntax error`, "lua");
        expect(findings[0]).toMatchObject({
            column: 5,
            file: "C:\\src\\bad.lua",
            line: 3,
            ruleId: "E011",
            severity: "error",
        });
    });

    it("returns [] on empty output or lines with no code marker", () => {
        expect(parseLuacheckOutput("", "lua")).toEqual([]);
        expect(parseLuacheckOutput("Total: 0 warnings / 0 errors in 1 file", "lua")).toEqual([]);
    });
});
