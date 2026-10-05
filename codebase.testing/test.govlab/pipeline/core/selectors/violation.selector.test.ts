import { describe, expect, it } from "vitest";
import { lastCount } from "@govlab/pipeline/core/selectors/violation.selector.ts";

describe("lastCount", () => {
    it("reads the count that precedes the keyword", () => {
        expect(lastCount("12 errors")).toBe(12);
    });

    it("takes the last occurrence, so a tail summary wins over an earlier line", () => {
        expect(lastCount("3 errors\nsome output\n7 errors")).toBe(7);
    });

    it("prefers the earliest keyword in the vocabulary over a later one", () => {
        expect(lastCount("5 errors, 9 advisories")).toBe(5);
    });

    it("matches regardless of case", () => {
        expect(lastCount("4 PROBLEMS")).toBe(4);
    });

    it("tolerates spaces between the count and the keyword", () => {
        expect(lastCount("8   findings")).toBe(8);
    });

    it("returns null when a keyword carries no leading count", () => {
        expect(lastCount("errors were found")).toBeNull();
    });

    it("returns null when the output names no counted keyword", () => {
        expect(lastCount("everything is fine")).toBeNull();
    });

    it("reads zero as a count rather than as absence", () => {
        expect(lastCount("0 violations")).toBe(0);
    });
});
