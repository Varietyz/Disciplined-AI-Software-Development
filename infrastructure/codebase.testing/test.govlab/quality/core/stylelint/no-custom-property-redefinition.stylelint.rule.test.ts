import { describe, expect, it } from "vitest";
import noCustomPropertyRedefinition, {
    RULE_META,
} from "@govlab/quality/core/stylelint/no-custom-property-redefinition.stylelint.rule.ts";
import stylelint from "stylelint";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({
        code,
        config: { plugins: [noCustomPropertyRedefinition], rules: { [RULE_META.ruleName]: true } },
    });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/no-custom-property-redefinition", () => {
    it("reports a custom property declared twice in one block", async () => {
        expect(await lint(":root { --gap: 1rem; --gap: 2rem; }")).toStrictEqual([RULE_META.ruleName]);
    });

    it("allows the same property in separate blocks", async () => {
        expect(await lint(":root { --gap: 1rem; } .dense { --gap: 0.5rem; }")).toStrictEqual([]);
    });
});
