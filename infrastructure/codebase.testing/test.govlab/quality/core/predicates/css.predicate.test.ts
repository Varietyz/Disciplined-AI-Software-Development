import { customPropertyStartsWith, hasPxUnit, insideAtRule } from "@govlab/quality/core/predicates/css.predicate.ts";
import { expect, test } from "vitest";

test("hasPxUnit reports a px token anywhere in the value", () => {
    expect(hasPxUnit("1rem 2px")).toBe(true);
    expect(hasPxUnit("1rem 50%")).toBe(false);
});

test("customPropertyStartsWith matches the prefix unless an exclusion occurs in the name", () => {
    expect(customPropertyStartsWith("--border-width", "--border-")).toBe(true);
    expect(customPropertyStartsWith("--border-neutral", "--border-", ["neutral"])).toBe(false);
    expect(customPropertyStartsWith("--space-sm", "--border-")).toBe(false);
});

test("insideAtRule walks the ancestors for a named at-rule", () => {
    const media = { name: "media", type: "atrule" };
    const rule = { parent: media, type: "rule" };
    const decl = { parent: rule, type: "decl" };
    expect(insideAtRule(decl, new Set(["media"]))).toBe(true);
    expect(insideAtRule(decl, new Set(["container"]))).toBe(false);
    expect(insideAtRule(undefined, new Set(["media"]))).toBe(false);
});
