import { describe, expect, it } from "vitest";
import noNativeAppearance, { RULE_META } from "@govlab/quality/core/stylelint/no-native-appearance.stylelint.rule.ts";
import stylelint from "stylelint";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({
        code,
        config: { plugins: [noNativeAppearance], rules: { [RULE_META.ruleName]: true } },
    });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/no-native-appearance", () => {
    it("reports an appearance value that restores host chrome", async () => {
        expect(await lint("select { appearance: auto; }")).toStrictEqual([RULE_META.ruleName]);
    });

    it("allows the reset values", async () => {
        expect(await lint("select { appearance: none; -webkit-appearance: none; }")).toStrictEqual([]);
    });
});
