import {
    countIn,
    movedOf,
    verdictKey,
    worstOf,
    worstVerdicts,
} from "coordination-surface/tools/core/comparators/gate.comparator.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("verdictKey", () => {
    it("keys a verdict by its rule, and by rule and kind when the rule proves several kinds", () => {
        const unkinded: { readonly kind?: string } = {};
        assert.equal(verdictKey("board", unkinded.kind), "board");
        assert.equal(verdictKey("board", "fence"), "board/fence");
    });
});

describe("worstOf and worstVerdicts", () => {
    it("keep the first state that is not clear, so one failing branch holds the whole kind", () => {
        assert.equal(worstOf(undefined, "proven"), "proven");
        assert.equal(worstOf("proven", "silent"), "silent");
        assert.equal(worstOf("silent", "proven"), "silent");
        assert.deepEqual(
            worstVerdicts([
                ["a", "proven"],
                ["a", "noisy"],
                ["a", "proven"],
                ["b", "exempt"],
            ]),
            { a: "noisy", b: "exempt" },
        );
    });
});

describe("movedOf", () => {
    it("lists each kind whose verdict changed since the prior run, noting a kind whose fixture reads the tree", () => {
        const moved = movedOf({ a: "noisy", b: "proven", c: "proven" }, { a: "proven", b: "proven" }, ["a: reads x"]);
        const [first = ""] = moved;
        assert.equal(moved.length, 1);
        assert.ok(first.startsWith("a: proven → noisy"));
        assert.ok(first.length > "a: proven → noisy".length);
        assert.deepEqual(movedOf({ b: "silent" }, { b: "proven" }, []), ["b: proven → silent"]);
    });
});

describe("countIn", () => {
    it("counts the outcomes in one state", () => {
        const outcomes = [
            { detail: "", rule: "a", state: "proven" as const },
            { detail: "", rule: "b", state: "silent" as const },
            { detail: "", rule: "c", state: "proven" as const },
        ];
        assert.equal(countIn(outcomes, "proven"), 2);
        assert.equal(countIn(outcomes, "exempt"), 0);
    });
});
