import { describe, expect, it } from "vitest";
import shrinkableGridTrack from "@govlab/quality/core/stylelint/shrinkable-grid-track.stylelint.rule.ts";
import stylelint from "stylelint";

const RULE = "govlab/shrinkable-grid-track";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({ code, config: { plugins: [shrinkableGridTrack], rules: { [RULE]: true } } });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/shrinkable-grid-track", () => {
    it("reports a bare fraction track", async () => {
        expect(await lint(".grid { grid-template-columns: 1fr; }")).toStrictEqual([RULE]);
    });

    it("reports a bare fraction beside a fixed track", async () => {
        expect(await lint(".row { grid-template-columns: auto 1fr; }")).toStrictEqual([RULE]);
    });

    it("reports a bare fraction repeated by repeat()", async () => {
        expect(await lint(".grid { grid-template-columns: repeat(3, 1fr); }")).toStrictEqual([RULE]);
    });

    it("reports a bare fraction in the implicit column size", async () => {
        expect(await lint(".grid { grid-auto-columns: 2fr; }")).toStrictEqual([RULE]);
    });

    it("allows a fraction that minmax() lets shrink", async () => {
        expect(await lint(".row { grid-template-columns: auto minmax(0, 1fr) auto; }")).toStrictEqual([]);
    });

    it("allows a fraction nested inside minmax() within repeat()", async () => {
        const code = ".cards { grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr)); }";
        expect(await lint(code)).toStrictEqual([]);
    });

    it("leaves row tracks alone", async () => {
        expect(await lint(".grid { grid-template-rows: 1fr auto; }")).toStrictEqual([]);
    });
});
