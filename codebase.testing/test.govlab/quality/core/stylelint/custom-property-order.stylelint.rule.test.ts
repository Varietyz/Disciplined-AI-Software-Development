import { describe, expect, it } from "vitest";
import customPropertyOrder, { RULE_META } from "@govlab/quality/core/stylelint/custom-property-order.stylelint.rule.ts";
import stylelint from "stylelint";

const TOKENS_FILE = "tokens.css";

const lint = async function lint(code: string, codeFilename: string): Promise<readonly string[]> {
    const result = await stylelint.lint({
        code,
        codeFilename,
        config: {
            plugins: [customPropertyOrder],
            rules: { [RULE_META.ruleName]: [true, { tokensFile: TOKENS_FILE }] },
        },
    });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/custom-property-order", () => {
    it("reports a same-prefix token declared after a larger one in the tokens file", async () => {
        expect(await lint(":root { --font-sm: 1rem; --font-md: 0.8rem; }", TOKENS_FILE)).toStrictEqual([
            RULE_META.ruleName,
        ]);
    });

    it("allows ascending tokens, and ignores files outside the tokens layer", async () => {
        expect(await lint(":root { --font-sm: 0.8rem; --font-md: 1rem; }", TOKENS_FILE)).toStrictEqual([]);
        expect(await lint(":root { --font-sm: 1rem; --font-md: 0.8rem; }", "page.css")).toStrictEqual([]);
    });
});
