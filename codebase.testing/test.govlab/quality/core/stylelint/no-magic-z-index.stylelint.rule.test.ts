import { describe, expect, it } from "vitest";
import noMagicZIndex, { RULE_META } from "@govlab/quality/core/stylelint/no-magic-z-index.stylelint.rule.ts";
import stylelint from "stylelint";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({
        code,
        config: { plugins: [noMagicZIndex], rules: { [RULE_META.ruleName]: [true, { zTokenPrefix: "var(--z-" }] } },
    });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/no-magic-z-index", () => {
    it("reports a bare integer and a calc offset", async () => {
        expect(await lint(".modal { z-index: 999; }")).toStrictEqual([RULE_META.ruleName]);
        expect(await lint(".modal { z-index: calc(var(--z-overlay) + 1); }")).toStrictEqual([RULE_META.ruleName]);
    });

    it("allows a declared token and the neutral keywords", async () => {
        expect(await lint(".modal { z-index: var(--z-overlay); } .base { z-index: auto; }")).toStrictEqual([]);
    });
});
