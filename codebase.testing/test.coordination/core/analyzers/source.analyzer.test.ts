import {
    braceDelta,
    codeMask,
    identifiersIn,
    isWordChar,
    matchesAt,
    memberKey,
    memberValue,
    spacesFrom,
    wordFrom,
} from "coordination-surface/tools/core/analyzers/source.analyzer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("isWordChar and codeMask", () => {
    it("count the dollar sign as a word character, and mark only the characters outside quotes as code", () => {
        assert.equal(isWordChar("$"), true);
        assert.equal(isWordChar("-"), false);
        assert.deepEqual(codeMask('a"b"c'), [true, false, false, false, true]);
        assert.deepEqual(codeMask(String.raw`"\""x`), [false, false, false, false, true]);
    });
});

describe("matchesAt, spacesFrom and wordFrom", () => {
    it("match a whole word only, and read past spaces and across one word", () => {
        assert.equal(matchesAt("foo bar", 4, "bar"), true);
        assert.equal(matchesAt("foobar", 3, "bar"), false);
        assert.equal(matchesAt("bar_x", 0, "bar"), false);
        assert.equal(spacesFrom("a   b", 1), 4);
        assert.equal(wordFrom("ab$c d", 0), "ab$c");
    });
});

describe("identifiersIn", () => {
    it("lists the identifiers of a line of code, skipping the words inside strings", () => {
        assert.deepEqual(identifiersIn('const x = "y z"; w'), ["const", "x", "w"]);
    });
});

describe("memberKey, memberValue and braceDelta", () => {
    it("read a letters-only object member, and count how far a line opens or closes braces", () => {
        assert.equal(memberKey("kind: frozen,"), "kind");
        assert.equal(memberValue("kind: frozen,"), "frozen");
        assert.equal(memberValue("kind: 'frozen'"), "");
        assert.equal(memberKey("two words: x"), "");
        assert.equal(memberValue("no colon"), "");
        assert.equal(braceDelta("{ { }"), 1);
        assert.equal(braceDelta("}"), -1);
    });
});
