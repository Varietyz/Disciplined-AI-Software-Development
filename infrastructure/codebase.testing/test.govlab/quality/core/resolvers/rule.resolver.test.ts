import { describe, expect, it } from "vitest";
import type { ConcernConfig } from "@govlab/quality/types/concern.types.ts";
import { enabledRuleIds } from "@govlab/quality/core/resolvers/rule.resolver.ts";

const LONG_FN = 20;
const MANY_PARAMS = 4;

const concerns = function concerns(entries: [string, number][]): ConcernConfig {
    return Object.fromEntries(entries);
};

const CLIPPY_CONCERNS = concerns([
    ["long-function", LONG_FN],
    ["too-many-params", MANY_PARAMS],
]);

describe("enabledRuleIds", () => {
    it("maps the clippy threshold concerns to their lint ids for -W enablement", () => {
        const lints = enabledRuleIds(CLIPPY_CONCERNS, "rust", "clippy");
        expect(lints).toContain("clippy::too_many_lines");
        expect(lints).toContain("clippy::too_many_arguments");
    });

    it("returns a deduped, sorted set", () => {
        const lints = enabledRuleIds(CLIPPY_CONCERNS, "rust", "clippy");
        expect(lints).toEqual([...new Set(lints)].sort((a, b) => a.localeCompare(b)));
    });

    it("returns [] for a tool with no mapped concerns", () => {
        expect(enabledRuleIds(concerns([["long-function", LONG_FN]]), "rust", "no-such-tool")).toEqual([]);
    });
});
