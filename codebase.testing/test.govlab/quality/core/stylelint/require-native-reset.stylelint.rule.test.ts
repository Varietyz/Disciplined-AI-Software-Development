import { describe, expect, it } from "vitest";
import requireNativeReset, { RULE_META } from "@govlab/quality/core/stylelint/require-native-reset.stylelint.rule.ts";
import stylelint from "stylelint";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({
        code,
        config: { plugins: [requireNativeReset], rules: { [RULE_META.ruleName]: true } },
    });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/require-native-reset", () => {
    it("reports a host pseudo-element styled without a reset", async () => {
        expect(await lint("input::-webkit-slider-thumb { background: red; }")).toStrictEqual([RULE_META.ruleName]);
    });

    it("allows the pseudo-element once it is reset", async () => {
        expect(await lint("input::-webkit-slider-thumb { appearance: none; background: red; }")).toStrictEqual([]);
    });
});
