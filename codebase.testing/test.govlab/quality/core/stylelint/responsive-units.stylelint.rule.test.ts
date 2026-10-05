import { describe, expect, it } from "vitest";
import responsiveUnits, { RULE_META } from "@govlab/quality/core/stylelint/responsive-units.stylelint.rule.ts";
import stylelint from "stylelint";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({
        code,
        config: { plugins: [responsiveUnits], rules: { [RULE_META.ruleName]: true } },
    });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/responsive-units", () => {
    it("reports a fixed px size on a scaling property", async () => {
        expect(await lint(".a { font-size: 16px; }")).toStrictEqual([RULE_META.ruleName]);
    });

    it("allows relative units and px inside media queries", async () => {
        expect(await lint(".a { font-size: 1rem; width: 50%; }")).toStrictEqual([]);
        expect(await lint("@media (width >= 40rem) { .a { width: 600px; } }")).toStrictEqual([]);
    });
});
