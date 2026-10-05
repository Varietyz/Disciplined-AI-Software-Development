import { describe, expect, it } from "vitest";
import noShadow, { RULE_META } from "@govlab/quality/core/stylelint/no-shadow.stylelint.rule.ts";
import stylelint from "stylelint";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({
        code,
        config: { plugins: [noShadow], rules: { [RULE_META.ruleName]: true } },
    });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/no-shadow", () => {
    it("reports a shadow declaration and a drop-shadow filter", async () => {
        expect(await lint(".card { box-shadow: 0 1px 2px black; }")).toStrictEqual([RULE_META.ruleName]);
        expect(await lint(".card { filter: drop-shadow(0 1px 2px black); }")).toStrictEqual([RULE_META.ruleName]);
    });

    it("allows a filter without a shadow", async () => {
        expect(await lint(".card { filter: blur(2px); }")).toStrictEqual([]);
    });
});
