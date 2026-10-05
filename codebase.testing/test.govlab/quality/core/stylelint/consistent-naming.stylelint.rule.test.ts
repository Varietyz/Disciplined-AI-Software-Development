import { describe, expect, it } from "vitest";
import consistentNaming, { RULE_META } from "@govlab/quality/core/stylelint/consistent-naming.stylelint.rule.ts";
import stylelint from "stylelint";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({
        code,
        config: { plugins: [consistentNaming], rules: { [RULE_META.ruleName]: true } },
    });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/consistent-naming", () => {
    it("reports an uppercase class and an underscore outside BEM", async () => {
        expect(await lint(".Card { color: red; }")).toStrictEqual([RULE_META.ruleName]);
        expect(await lint(".card_title { color: red; }")).toStrictEqual([RULE_META.ruleName]);
    });

    it("allows kebab-case and valid BEM", async () => {
        expect(await lint(".card-title, .card__title--large { color: red; }")).toStrictEqual([]);
    });
});
