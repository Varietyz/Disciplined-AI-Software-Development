import { expect, test } from "vitest";
import { withCanon } from "@govlab/quality/core/formatters/canon.formatter.ts";

test("withCanon tags the text with the rule id and, when concepts are given, their canon references", () => {
    expect(withCanon("Fix it.", "some_rule", [])).toBe("Fix it. [some_rule]");
    expect(withCanon("Fix it.", "some_rule", ["magic-number"])).toBe(
        "Fix it. [some_rule] [canon: quality:concept:magic-number]",
    );
});
