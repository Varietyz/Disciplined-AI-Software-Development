import { describe, expect, it } from "vitest";
import noCssMagicNumber, { RULE_META } from "@govlab/quality/core/stylelint/no-css-magic-number.stylelint.rule.ts";
import stylelint from "stylelint";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({
        code,
        config: { plugins: [noCssMagicNumber], rules: { [RULE_META.ruleName]: true } },
    });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/no-css-magic-number", () => {
    it("reports a raw length", async () => {
        expect(await lint(".box { margin: 13px; }")).toStrictEqual([RULE_META.ruleName]);
    });

    it("allows tokens, the exempt values and media queries", async () => {
        expect(await lint(".box { margin: var(--space-2); width: 100%; padding: 0; }")).toStrictEqual([]);
        expect(await lint("@media (width >= 40rem) { .box { margin: 13px; } }")).toStrictEqual([]);
    });
});
