import { describe, expect, it } from "vitest";
import { parseStyluaCheck, unformattedFinding } from "@govlab/quality/core/parsers/tool.stylua.parser.ts";

describe("unformattedFinding", () => {
    it("reports an unformatted file as a fixable gating finding", () => {
        expect(unformattedFinding("src/a.lua", "lua")).toMatchObject({
            advisory: false,
            file: "src/a.lua",
            fixable: true,
            ruleId: "stylua/format",
        });
    });
});

const RECORDED = [
    "Diff in src/a.lua:",
    "1  |-x={1,2}",
    "   1|+x = { 1, 2 }",
    "Diff in src/b.lua:",
    "1  |-y=2",
    "   1|+y = 2",
].join("\n");

describe("parseStyluaCheck", () => {
    it("extracts one file per 'Diff in <file>:' header, dropping the trailing colon", () => {
        expect(parseStyluaCheck(RECORDED)).toEqual(["src/a.lua", "src/b.lua"]);
    });

    it("returns [] when every file is already formatted (no Diff headers)", () => {
        expect(parseStyluaCheck("")).toEqual([]);
        expect(parseStyluaCheck("nothing to report here")).toEqual([]);
    });
});
