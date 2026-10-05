import {
    isAsciiAlpha,
    isAsciiDigit,
    isAsciiLower,
    isAsciiUpper,
    isCssNameChar,
    isDot,
    isIdentChar,
    isKebabChar,
    isSnakeTail,
} from "@govlab/quality/core/predicates/code-point.predicate.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const codeOf = function codeOf(ch: string): number {
    return ch.codePointAt(0) ?? 0;
};

test("isAsciiUpper and isAsciiLower split the ASCII letters by case", () => {
    assert.equal(isAsciiUpper(codeOf("A")), true);
    assert.equal(isAsciiUpper(codeOf("a")), false);
    assert.equal(isAsciiLower(codeOf("z")), true);
    assert.equal(isAsciiLower(codeOf("Z")), false);
});

test("isAsciiAlpha and isAsciiDigit separate letters from digits and reject a missing code", () => {
    assert.equal(isAsciiAlpha(codeOf("q")), true);
    assert.equal(isAsciiAlpha(codeOf("7")), false);
    assert.equal(isAsciiDigit(codeOf("7")), true);
    assert.equal(isAsciiDigit(), false);
});

test("isKebabChar accepts lowercase letters, digits and the hyphen only", () => {
    assert.equal(isKebabChar(codeOf("a")), true);
    assert.equal(isKebabChar(codeOf("-")), true);
    assert.equal(isKebabChar(codeOf("A")), false);
    assert.equal(isKebabChar(codeOf("_")), false);
});

test("isDot matches the full stop only", () => {
    assert.equal(isDot(codeOf(".")), true);
    assert.equal(isDot(codeOf(",")), false);
});

test("isIdentChar accepts identifier characters", () => {
    assert.equal(isIdentChar(codeOf("9")), true);
    assert.equal(isIdentChar(codeOf("_")), true);
    assert.equal(isIdentChar(codeOf("$")), true);
    assert.equal(isIdentChar(codeOf("-")), false);
});

test("isSnakeTail accepts digits and underscore", () => {
    assert.equal(isSnakeTail(codeOf("0")), true);
    assert.equal(isSnakeTail(codeOf("_")), true);
    assert.equal(isSnakeTail(codeOf("a")), false);
});

test("isCssNameChar accepts css name characters", () => {
    assert.equal(isCssNameChar(codeOf("a")), true);
    assert.equal(isCssNameChar(codeOf("-")), true);
    assert.equal(isCssNameChar(codeOf("_")), true);
    assert.equal(isCssNameChar(codeOf("$")), false);
});
