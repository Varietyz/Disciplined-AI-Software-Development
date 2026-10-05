import { describe, expect, it } from "vitest";
import {
    intAfter,
    intAt,
    isDigitsOnly,
    trailingIdentifier,
    withoutRubyTags,
} from "@govlab/quality/core/parsers/knob.parser.ts";

const TWELVE = 12;
const FORTY = 40;
const WINDOW = 8;

describe("intAt", () => {
    it("reads the first digit run after leading non-digits", () => {
        expect(intAt("abc 12 def", 0)).toBe(TWELVE);
        expect(intAt("no digits", 0)).toBeNull();
    });

    it("stops at line and statement boundaries", () => {
        expect(intAt("ab\n12", 0)).toBeNull();
        expect(intAt("ab;12", 0)).toBeNull();
    });
});

describe("intAfter", () => {
    it("finds an integer following a marker within the window", () => {
        expect(intAfter("size = 40;", "size", { from: 0 })).toBe(FORTY);
        expect(intAfter("size = 40;", "size", { from: 0, window: WINDOW })).toBe(FORTY);
        expect(intAfter("nope 5", "size", { from: 0 })).toBeNull();
    });

    it("refuses a marker past the window", () => {
        expect(intAfter("padding padding size = 4", "size", { from: 0, window: 1 })).toBeNull();
    });
});

describe("withoutRubyTags", () => {
    it("strips the ruby tags and keeps plain text", () => {
        expect(withoutRubyTags("x!ruby/z y")).toBe("x y");
        expect(withoutRubyTags("plain")).toBe("plain");
    });
});

describe("isDigitsOnly", () => {
    it("checks a string is all digits", () => {
        expect(isDigitsOnly("123")).toBe(true);
        expect(isDigitsOnly("12a")).toBe(false);
        expect(isDigitsOnly("")).toBe(false);
    });
});

describe("trailingIdentifier", () => {
    it("keeps the trailing identifier run", () => {
        expect(trailingIdentifier("foo-bar_baz")).toBe("bar_baz");
        expect(trailingIdentifier("abc")).toBe("abc");
    });
});
