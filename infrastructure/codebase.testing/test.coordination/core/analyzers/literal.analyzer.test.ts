import {
    callBefore,
    isPathShaped,
    lineOf,
    quotedLiterals,
    unboundedEnumerations,
} from "coordination-surface/tools/core/analyzers/literal.analyzer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("lineOf", () => {
    it("counts the line an index falls on, from one", () => {
        assert.equal(lineOf("a\nb\nc", 0), 1);
        assert.equal(lineOf("a\nb\nc", 4), 3);
    });
});

describe("unboundedEnumerations", () => {
    it("reports a recursive listing rooted at the whole project, and passes one narrowed to the surface", () => {
        const source = [
            "const all = readdirSync(repoRoot, { recursive: true });",
            "const own = readdirSync(surfacePath(repoRoot), { recursive: true });",
            "const flat = readdirSync(repoRoot);",
            'const text = "readdirSync(repoRoot, { recursive: true })";',
        ].join("\n");
        assert.deepEqual(unboundedEnumerations(source), [{ line: 1, root: "repoRoot" }]);
    });
});

describe("isPathShaped", () => {
    it("reads a single token as a path, and never a module name, an encoding, prose or nothing", () => {
        assert.equal(isPathShaped("config/surface"), true);
        assert.equal(isPathShaped("board.rule.ts"), false);
        assert.equal(isPathShaped("utf8"), false);
        assert.equal(isPathShaped("two words"), false);
        assert.equal(isPathShaped(""), false);
    });
});

describe("callBefore", () => {
    it("names the plain call a quoted argument opens, and nothing for a method call or a bare string", () => {
        const plain = 'join( "a")';
        const method = 'path.join("a")';
        const bare = 'const a = "a"';
        assert.equal(callBefore(plain, plain.indexOf('"')), "join");
        assert.equal(callBefore(method, method.indexOf('"')), "");
        assert.equal(callBefore(bare, bare.indexOf('"')), "");
    });
});

describe("quotedLiterals", () => {
    it("lists each single and double quoted literal with its span, honoring escapes and stopping at an open quote", () => {
        const source = String.raw`call("a\"b", 'c') "open`;
        assert.deepEqual(
            quotedLiterals(source).map((quoted) => quoted.value),
            [String.raw`a\"b`, "c"],
        );
        const [first] = quotedLiterals(source);
        assert.equal(source.charAt(first?.open ?? -1), '"');
        assert.equal(source.charAt(first?.close ?? -1), '"');
    });
});
