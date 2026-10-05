import { expect, test } from "vitest";
import { typeSystemRuleOptions } from "@govlab/quality/core/converters/stylelint.converter.ts";

const TOKENS = "tokens.css";

test("typeSystemRuleOptions configures only the enabled type-system rules", () => {
    const rules = { "govlab/custom-property-order": true, "govlab/no-magic-z-index": true };
    expect(typeSystemRuleOptions({ tokensFile: TOKENS, zTokenPrefix: "--z-" }, rules)).toMatchObject({
        "govlab/custom-property-order": [true, { tokensFile: TOKENS }],
        "govlab/no-magic-z-index": [true, { tokensFile: TOKENS, zTokenPrefix: "--z-" }],
    });
    expect(typeSystemRuleOptions({ tokensFile: TOKENS }, {})).toStrictEqual({});
    expect(typeSystemRuleOptions(undefined, rules)).toStrictEqual({});
});
