import { expect, test } from "vitest";
import { captureValue } from "@govlab/quality/core/parsers/constants.parser.ts";

test("captureValue reads a declaration's value up to its closing semicolon, across lines", () => {
    expect(captureValue(["const MAX = 3;"], 0)).toStrictEqual({ endIndex: 0, value: "3" });
    const lines = ["const TONE = {", '    high: "danger",', "};", "const OTHER = 1;"];
    expect(captureValue(lines, 0).endIndex).toBe(2);
    expect(captureValue(lines, 0).value.startsWith("{")).toBe(true);
});
