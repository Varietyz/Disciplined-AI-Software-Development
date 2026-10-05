import { describe, expect, it } from "vitest";
import { isDomainMeta, isDomainSub } from "@govlab/docs/core/predicates/taxonomy.domain.predicate.ts";
import { DOMAIN_TAXONOMY } from "@govlab/docs/configuration/constants/taxonomy.domain.constants.ts";

describe("the domain vocabulary", () => {
    it("gives every meta unique, non-empty sub-domains", () => {
        const subLists = Object.values(DOMAIN_TAXONOMY);
        expect(subLists.length).toBeGreaterThan(0);
        expect(subLists.filter((subs) => subs.length === 0 || new Set(subs).size !== subs.length)).toStrictEqual([]);
    });
});

describe("isDomainMeta and isDomainSub", () => {
    it("accept a known meta and pair, and refuse everything else", () => {
        expect(isDomainMeta("security")).toBe(true);
        expect(isDomainMeta("nonsense")).toBe(false);
        expect(isDomainMeta("")).toBe(false);
        expect(isDomainMeta(Number.NaN)).toBe(false);
        expect(isDomainSub("commerce", "payments")).toBe(true);
        expect(isDomainSub("commerce", "encryption")).toBe(false);
        expect(isDomainSub("nonsense", "payments")).toBe(false);
        expect(isDomainSub("commerce", Number.NaN)).toBe(false);
    });
});
