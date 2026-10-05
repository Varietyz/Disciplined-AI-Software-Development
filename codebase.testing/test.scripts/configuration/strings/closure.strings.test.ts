import { describe, expect, it } from "vitest";
import {
    graphLine,
    unmatchedBarrels,
    unmatchedPattern,
} from "@project/scripts/configuration/strings/closure.strings.ts";

describe("the closure graph's lines", () => {
    it("names each barrel whose pattern matches nothing, under a heading that counts them", () => {
        const line = unmatchedPattern("core/index.ts", "./*.missing.ts");
        const report = unmatchedBarrels([line]);
        expect(report).toContain("1 import.meta.glob pattern(s) match no files");
        expect(report).toContain(`  ${line}`);
    });

    it("lists every count with its label", () => {
        expect(graphLine({ exports: 3, registers: 1 })).toBe("closure-graph: 3 exports, 1 registers\n");
    });
});
