import {
    containsInCode,
    declaresProperty,
    filesystemImports,
    reachesRegexLiteral,
} from "coordination-surface/tools/core/predicates/source.predicate.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("filesystemImports", () => {
    it("lists each import line that reaches the filesystem module, and nothing else", () => {
        const source = [
            'import { readFileSync } from "node:fs";',
            '  import { join } from "node:path";',
            '// import { rmSync } from "node:fs";',
            'import { rmSync } from "node:fs";',
        ].join("\n");
        assert.deepEqual(filesystemImports(source), [
            'import { readFileSync } from "node:fs";',
            'import { rmSync } from "node:fs";',
        ]);
    });
});

describe("containsInCode", () => {
    it("finds a needle in code and not inside strings, escapes or comments", () => {
        assert.equal(containsInCode("const x = target;", "target"), true);
        assert.equal(containsInCode('const x = "target";', "target"), false);
        assert.equal(containsInCode("// target\n/* target */ y", "target"), false);
        assert.equal(containsInCode(String.raw`"a\"target" + b`, "target"), false);
        assert.equal(containsInCode("// note\ntarget()", "target"), true);
    });
});

describe("reachesRegexLiteral", () => {
    it("detects a literal passed to a member call or a method called on one", () => {
        assert.equal(reachesRegexLiteral("text.split(/,/)"), true);
        assert.equal(reachesRegexLiteral("/a/.test(text)"), true);
        assert.equal(reachesRegexLiteral("run(/* note */ x)"), false);
        assert.equal(reachesRegexLiteral("const half = total / 2;"), false);
    });
});

describe("declaresProperty", () => {
    it("recognizes a property declared as a key, a method or a shorthand", () => {
        assert.equal(declaresProperty("{ check: fn }", "check"), true);
        assert.equal(declaresProperty("{ check(context) {} }", "check"), true);
        assert.equal(declaresProperty("{ check }", "check"), true);
        assert.equal(declaresProperty('{ label: "check" }', "check"), false);
    });
});
