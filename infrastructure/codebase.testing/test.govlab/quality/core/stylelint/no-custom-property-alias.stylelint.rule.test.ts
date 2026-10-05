import { describe, expect, it } from "vitest";
import noCustomPropertyAlias from "@govlab/quality/core/stylelint/no-custom-property-alias.stylelint.rule.ts";
import stylelint from "stylelint";

const RULE = "govlab/no-custom-property-alias";
const ROOT_ALIAS = ":root { --accent: var(--gold); }";
const SCOPED_ALIAS = ":root { --gold: #cea555; } .page.grammar { --accent: var(--gold); }";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({
        code,
        config: { plugins: [noCustomPropertyAlias], rules: { [RULE]: true } },
    });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/no-custom-property-alias", () => {
    it("reports a root token that only aliases another custom property", async () => {
        expect(await lint(ROOT_ALIAS)).toStrictEqual([RULE]);
    });

    it("allows a scoped selector to re-bind a property to a root token", async () => {
        expect(await lint(SCOPED_ALIAS)).toStrictEqual([]);
    });
});
