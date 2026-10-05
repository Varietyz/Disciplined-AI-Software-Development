import { describe, expect, it } from "vitest";
import noLargeViewportUnit from "@govlab/quality/core/stylelint/no-large-viewport-unit.stylelint.rule.ts";
import stylelint from "stylelint";

const RULE = "govlab/no-large-viewport-unit";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({ code, config: { plugins: [noLargeViewportUnit], rules: { [RULE]: true } } });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/no-large-viewport-unit", () => {
    it("reports a height in vh", async () => {
        expect(await lint(".shell { height: 100vh; }")).toStrictEqual([RULE]);
    });

    it("reports a token that stores a vh length", async () => {
        expect(await lint(":root { --viewport-full: 100vh; }")).toStrictEqual([RULE]);
    });

    it("reports vh inside a calculation", async () => {
        expect(await lint(".panel { max-height: calc(var(--row) * 90vh); }")).toStrictEqual([RULE]);
    });

    it("allows the dynamic, small and large viewport units", async () => {
        expect(await lint(".shell { height: 100dvh; min-height: 100svh; max-height: 100lvh; }")).toStrictEqual([]);
    });

    it("allows the viewport width unit", async () => {
        expect(await lint(".title { font-size: clamp(1rem, 3vw, 2rem); }")).toStrictEqual([]);
    });
});
