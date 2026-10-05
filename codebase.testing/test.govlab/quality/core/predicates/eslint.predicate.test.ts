import { expect, test } from "vitest";
import {
    inHostScope,
    isCorePlugin,
    isParser,
    isPlugin,
    isRuleEntry,
    isRuleModule,
    underAny,
} from "@govlab/quality/core/predicates/eslint.predicate.ts";
import type { ScopeCarrier } from "@govlab/quality/types/eslint.types.ts";

const contextFor = function contextFor(filename: string, layout: Record<string, string[]>): ScopeCarrier {
    return { filename, settings: { govlab: { layout } } };
};

test("underAny matches a fragment of the linted filename and refuses an empty fragment list", () => {
    const context = contextFor("src/app/page.ts", {});
    expect(underAny(context, ["/app/"])).toBe(true);
    expect(underAny(context, [])).toBe(false);
    expect(underAny(context)).toBe(false);
});

test("inHostScope holds under a frontend marker unless a backend marker also matches", () => {
    const layout = { backendMarkers: ["/server/"], frontendMarkers: ["/app/"] };
    expect(inHostScope(contextFor("src/app/page.ts", layout))).toBe(true);
    expect(inHostScope(contextFor("src/app/server/page.ts", layout))).toBe(false);
    expect(inHostScope(contextFor("src/lib/page.ts", layout))).toBe(false);
});

test("the module guards recognize plugins, parsers, rule entries and core plugins", () => {
    expect(isPlugin({})).toBe(true);
    expect(isParser(null)).toBe(false);
    expect(isRuleEntry("error")).toBe(true);
    expect(isRuleEntry({})).toBe(false);
    expect(isCorePlugin("@govlab/quality/eslint-plugin")).toBe(true);
    expect(isCorePlugin("eslint-plugin-sonarjs")).toBe(false);
    expect(isRuleModule({ create: (): Record<string, never> => ({}) })).toBe(true);
    expect(isRuleModule({ meta: {} })).toBe(false);
});
