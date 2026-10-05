import { describe, expect, it } from "vitest";
import { isBase64Url, isInAlphabet } from "@ssot/secrets/core/predicates/character.predicate.ts";

describe("isInAlphabet and isBase64Url", () => {
    it("hold a text to its declared alphabet", () => {
        expect(isInAlphabet("abc123", "alnum")).toBe(true);
        expect(isInAlphabet("abc-123", "alnum")).toBe(false);
        expect(isInAlphabet("abc-123", "alnumDash")).toBe(true);
        expect(isInAlphabet("ABC123", "upperDigit")).toBe(true);
        expect(isInAlphabet("Abc123", "upperDigit")).toBe(false);
        expect(isBase64Url("aB9-_")).toBe(true);
        expect(isBase64Url("aB9+/")).toBe(false);
    });
});
