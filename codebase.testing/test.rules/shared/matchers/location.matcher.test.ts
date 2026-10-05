import { describe, expect, it } from "vitest";
import {
    hintLiteralsOf,
    isPathLike,
    isSegmentLike,
    joinedPathsOf,
    stringLiteralsOf,
    stripComments,
} from "@ssot/govlab/shared/matchers/location.matcher.ts";
import { relativePath } from "@ssot/paths";

describe("isSegmentLike and isPathLike", () => {
    it("accepts a plain path segment and refuses specifiers, flags and manifests", () => {
        expect(isSegmentLike("folder")).toBe(true);
        expect(isSegmentLike("@scope/pkg")).toBe(false);
        expect(isSegmentLike("--flag")).toBe(false);
        expect(isSegmentLike("package.json")).toBe(false);
    });

    it("treats a slash-joined value or a source filename as path-like and a media type or system path as not", () => {
        expect(isPathLike(`${relativePath("app.member")}/core/probe.ts`)).toBe(true);
        expect(isPathLike("probe.ts")).toBe(true);
        expect(isPathLike("text/plain")).toBe(false);
        expect(isPathLike("/usr/bin/env")).toBe(false);
        expect(isPathLike(".hidden")).toBe(false);
        expect(isPathLike(`${relativePath("govlabHost.shared")}/resolvers/anchor.resolver.ts`)).toBe(false);
    });
});

describe("stripComments and stringLiteralsOf", () => {
    it("drops line and block comments and keeps the literals of the remaining code", () => {
        const text = `const a = "x"; // "hidden"\n/* "also" */ const b = 'y';`;
        expect(stringLiteralsOf(stripComments(text))).toStrictEqual(["x", "y"]);
    });
});

describe("joinedPathsOf and hintLiteralsOf", () => {
    it("joins the literal segments handed to a path join and reads the declared hints", () => {
        const text = `join(root, "a", "b"); const X_HINTS = ["a/b", "c"];`;
        expect(joinedPathsOf(text)).toStrictEqual(["a/b"]);
        expect([...hintLiteralsOf(text)]).toStrictEqual(["a/b", "c"]);
    });
});
