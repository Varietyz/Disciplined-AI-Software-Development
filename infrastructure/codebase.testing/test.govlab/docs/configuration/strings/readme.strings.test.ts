import {
    chartsNote,
    defaultInstall,
    exampleLabel,
    metricsLine,
} from "@govlab/docs/configuration/strings/readme.strings.ts";
import { describe, expect, it } from "vitest";
import { unmatched } from "./strings.fixture.ts";

describe("the readme strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [chartsNote("charts.md"), "[charts.md](./charts.md)"],
                [defaultInstall("@govlab/x"), "`@govlab/x`"],
                [exampleLabel("Run"), " EXAMPLE: Run"],
                [exampleLabel(""), " EXAMPLE:"],
            ]),
        ).toStrictEqual([]);
        expect(metricsLine(1, 2, 3, 4)).toStrictEqual(["1 exports", "2 deps", "3 principles", "4 concepts"]);
    });
});
