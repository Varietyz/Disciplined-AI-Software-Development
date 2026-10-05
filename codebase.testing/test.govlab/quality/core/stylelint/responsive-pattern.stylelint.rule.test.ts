import { describe, expect, it } from "vitest";
import responsivePattern, { RULE_META } from "@govlab/quality/core/stylelint/responsive-pattern.stylelint.rule.ts";
import stylelint from "stylelint";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({
        code,
        config: { plugins: [responsivePattern], rules: { [RULE_META.ruleName]: true } },
    });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/responsive-pattern", () => {
    it("reports a desktop-first media query and a rigid clamp", async () => {
        expect(await lint("@media (max-width: 40rem) { .a { color: red; } }")).toStrictEqual([RULE_META.ruleName]);
        expect(await lint(".a { font-size: clamp(1rem, 2rem, 3rem); }")).toStrictEqual([RULE_META.ruleName]);
    });

    it("allows a mobile-first query and a fluid clamp", async () => {
        expect(await lint("@media (min-width: 40rem) { .a { font-size: clamp(1rem, 2vw, 3rem); } }")).toStrictEqual([]);
    });
});
