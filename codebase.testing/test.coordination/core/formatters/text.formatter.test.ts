import {
    appendSection,
    clipped,
    diffLines,
    safeKey,
} from "coordination-surface/tools/core/formatters/text.formatter.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("safeKey", () => {
    it("keeps letters and digits and spells every other character as a hyphen", () => {
        assert.equal(safeKey("collab.comms/A_1"), "collab-comms-A-1");
    });
});

describe("clipped and appendSection", () => {
    it("cut a value at its limit with an ellipsis, and append a section after one blank line", () => {
        assert.equal(clipped("abcdef", 3), "abc…");
        assert.equal(clipped("abc", 3), "abc");
        assert.equal(appendSection("# Doc", "## Added", "body"), "# Doc\n\n## Added\n\nbody\n");
        assert.equal(appendSection("# Doc\n", "## Added", "body"), "# Doc\n\n## Added\n\nbody\n");
    });
});

describe("diffLines", () => {
    it("lists removed lines, then added lines, counting repeated lines and ignoring blank ones", () => {
        const before = "keep\nold\nrepeat\nrepeat\n\n";
        const after = "keep\nnew\nrepeat\n\n\n";
        assert.deepEqual(diffLines(before, after), ["- old", "- repeat", "+ new"]);
    });

    it("reports nothing when the texts hold the same lines", () => {
        assert.deepEqual(diffLines("a\nb", "a\nb"), []);
    });
});
