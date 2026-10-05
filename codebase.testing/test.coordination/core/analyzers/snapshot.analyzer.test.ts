import {
    ANCHOR_KINDS,
    markedElsewhere,
    sameKinds,
} from "coordination-surface/tools/core/analyzers/snapshot.analyzer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const extent = function extent(mark: string): { anchors: string[]; lifetime: string; mark: string } {
    return { anchors: [], lifetime: "kept · frozen · none", mark };
};

describe("sameKinds", () => {
    it("answers whether a snapshot holds exactly the anchor kinds read today", () => {
        assert.equal(sameKinds([...ANCHOR_KINDS]), true);
        assert.equal(sameKinds([]), false);
        assert.equal(sameKinds(["other"]), false);
        assert.equal(sameKinds([...ANCHOR_KINDS, "other"]), false);
    });
});

describe("markedElsewhere", () => {
    it("names a new path that carries a vanished file's content mark, so a move is not read as a loss", () => {
        const current = new Map([
            ["kept.md", extent("m")],
            ["moved.md", extent("m")],
        ]);
        assert.equal(markedElsewhere("m", { "kept.md": extent("m") }, current), "moved.md");
        assert.equal(markedElsewhere("other", {}, current), null);
        assert.equal(markedElsewhere("", {}, current), null);
    });
});
