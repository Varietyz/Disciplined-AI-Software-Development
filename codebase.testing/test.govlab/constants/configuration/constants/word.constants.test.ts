import {
    AMERICAN_WORDS,
    IZE_STEMS,
    IZE_SUFFIXES,
    PLURAL_IES,
    PLURAL_KEPT_AFTER,
    PLURAL_MINIMUM_LENGTH,
    PLURAL_SUFFIX,
    SPELLING_PREFIXES,
} from "@govlab/constants/configuration/constants/word.constants.ts";
import { describe, expect, it } from "vitest";

describe("the plural rules", () => {
    it("fold a regular plural and an -ies plural, and keep the endings that are not plurals", () => {
        expect(PLURAL_SUFFIX).toBe("s");
        expect(PLURAL_IES).toStrictEqual(["ies", "y"]);
        expect([...PLURAL_KEPT_AFTER]).toStrictEqual(["i", "s", "u"]);
        expect(PLURAL_MINIMUM_LENGTH).toBeGreaterThan(PLURAL_SUFFIX.length);
    });
});

describe("the spelling tables", () => {
    it("map each British word to a different American one", () => {
        for (const [british, american] of Object.entries(AMERICAN_WORDS)) {
            expect(american).not.toBe(british);
        }
    });

    it("turn every -ise suffix into its -ize form", () => {
        for (const [british, american] of Object.entries(IZE_SUFFIXES)) {
            expect(american.replace("z", "s")).toBe(british);
        }
    });

    it("hold each stem once", () => {
        expect(new Set(IZE_STEMS).size).toBe(IZE_STEMS.length);
    });

    it("hold each prefix once, and no prefix is itself a stem or a listed word", () => {
        expect(new Set(SPELLING_PREFIXES).size).toBe(SPELLING_PREFIXES.length);
        expect(SPELLING_PREFIXES.filter((prefix) => IZE_STEMS.includes(prefix))).toStrictEqual([]);
        expect(SPELLING_PREFIXES.filter((prefix) => Object.hasOwn(AMERICAN_WORDS, prefix))).toStrictEqual([]);
    });
});
