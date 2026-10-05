import {
    countBy,
    remediate,
    rootOf,
    unresolvedFinding,
} from "coordination-surface/tools/core/transformers/corpus.transformer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("rootOf", () => {
    it("names the declared root a path sits under, and none for a path outside every root", () => {
        assert.equal(rootOf("tools/core/a.ts", ["config", "tools"]), "tools");
        assert.equal(rootOf("toolsmith/a.ts", ["tools"]), null);
    });
});

describe("remediate", () => {
    it("renames to the expected name when one is known, and leaves the rename to judgment otherwise", () => {
        assert.deepEqual(remediate("kit/core/Bad.ts", "bad.ts", "decide"), {
            action: "rename",
            decide: null,
            deterministic: true,
            from: "Bad.ts",
            target: "kit/core",
            to: "bad.ts",
        });
        assert.deepEqual(remediate("kit/core/Bad.ts", null, "decide").decide, "decide");
    });
});

describe("countBy and unresolvedFinding", () => {
    it("count items by a key, and file an unresolved corpus entry at its locus", () => {
        assert.deepEqual(
            countBy(["a.ts", "b.ts", "c.md"], (name) => name.slice(name.lastIndexOf("."))),
            { ".md": 1, ".ts": 2 },
        );
        const finding = unresolvedFinding("tools/x", "facet", "no facet", "decide");
        assert.equal(finding.rule, "corpus/unresolved");
        assert.deepEqual([finding.locus, finding.actual], ["facet", "no facet"]);
    });
});
