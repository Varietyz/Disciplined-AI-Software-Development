import { describe, expect, it } from "vitest";
import customPropertyUnitMismatch, {
    RULE_META,
} from "@govlab/quality/core/stylelint/custom-property-unit-mismatch.stylelint.rule.ts";
import stylelint from "stylelint";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({
        code,
        config: { plugins: [customPropertyUnitMismatch], rules: { [RULE_META.ruleName]: true } },
    });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/custom-property-unit-mismatch", () => {
    it("reports a rem-family token in px and a px-family token in rem", async () => {
        expect(await lint(":root { --space-2: 32px; }")).toStrictEqual([RULE_META.ruleName]);
        expect(await lint(":root { --border-thin: 0.1rem; }")).toStrictEqual([RULE_META.ruleName]);
    });

    it("allows each family in its own unit", async () => {
        expect(await lint(":root { --space-2: 2rem; --border-thin: 1px; }")).toStrictEqual([]);
    });
});
