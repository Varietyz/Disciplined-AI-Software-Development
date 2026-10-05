import { declaredTiers, escapedVocabulary } from "coordination-surface/tools/core/validators/verdict.validator.ts";
import { describe, it } from "vitest";
import { RULE_ROOT } from "coordination-surface/tools/core/constants/layer.constants.ts";
import assert from "node:assert/strict";
import { dirname } from "node:path";

describe("declaredTiers", () => {
    it("finds each capitalized middle tier by its line, and ignores the word in lower case or inside a longer word", () => {
        assert.deepEqual(declaredTiers("PASS\nWARN or info\nWARNING and NOTICED\n"), [
            { line: 2, tier: "warn" },
            { line: 3, tier: "warning" },
        ]);
    });
});

describe("escapedVocabulary", () => {
    it("names an exempt source that declares a middle tier and no rule imports", () => {
        const claimed = "tools/core/claimed.ts";
        const escaped = "tools/core/escaped.ts";
        const sources: Record<string, string> = {
            [`${RULE_ROOT}probe.rule.ts`]: 'import { tier } from "../core/claimed.ts";',
            [claimed]: 'export const tier = "warn";',
            [escaped]: 'export const tier = "advisory";',
            "tools/core/plain.ts": 'export const tier = "fail";',
        };
        const read = (path: string): string => sources[path] ?? "";
        assert.deepEqual(escapedVocabulary(Object.keys(sources), read, [`${dirname(claimed)}/`]), [escaped]);
    });
});
