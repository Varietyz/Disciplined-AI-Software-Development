import { describe, expect, it } from "vitest";
import {
    isIdentPart,
    isIdentStart,
    isSpace,
    lastIdent,
    lineAt,
    skipBalanced,
    skipIdent,
    skipIdentBack,
    skipSpaces,
    skipSpacesBack,
} from "@govlab/docs/core/lexers/code.go.lexer.ts";

describe("the character classes", () => {
    it("classify identifier and space characters, refusing an absent character", () => {
        expect([isIdentStart("a"), isIdentStart("_"), isIdentStart("1"), isIdentStart()]).toStrictEqual([
            true,
            true,
            false,
            false,
        ]);
        expect([isIdentPart("1"), isIdentPart("-")]).toStrictEqual([true, false]);
        expect([isSpace(" "), isSpace("x"), isSpace()]).toStrictEqual([true, false, false]);
    });
});

describe("the scanners", () => {
    it("skip spaces and identifiers in both directions within their bounds", () => {
        const src = "  name  ";
        expect(skipSpaces(src, 0, src.length)).toBe(2);
        expect(skipIdent(src, 2, src.length)).toBe(6);
        expect(skipSpacesBack(src, 7, 0)).toBe(5);
        expect(skipIdentBack(src, 5, 0)).toBe(1);
    });

    it("find the last identifier, the end of a balanced pair and the line of a position", () => {
        expect(lastIdent("s *Server")).toBe("Server");
        expect(lastIdent("(x) ")).toBe("x");
        expect(lastIdent("  ")).toBeNull();
        expect(skipBalanced("(a(b)c)d", 0, "()")).toBe(7);
        expect(lineAt("a\nb\nc", 4)).toBe(3);
    });
});
