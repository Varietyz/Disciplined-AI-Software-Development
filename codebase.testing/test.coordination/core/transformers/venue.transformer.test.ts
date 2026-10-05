import { INHERITED_BANNER, LIST_MARKER } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import {
    SUCCESSOR_FIELD,
    lastInheritedItem,
    successorWritten,
} from "coordination-surface/tools/core/transformers/venue.transformer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const DECLARATION = `${SUCCESSOR_FIELD} next-venue`;

describe("successorWritten", () => {
    it("replaces a written successor line, and otherwise adds one after the successor section's fenced specimen", () => {
        assert.equal(successorWritten(`# V\n${SUCCESSOR_FIELD} old\nrest`, DECLARATION), `# V\n${DECLARATION}\nrest`);
        const section = ["## SUCCESSOR", "```", `${SUCCESSOR_FIELD} <name>`, "```", "## NEXT"].join("\n");
        assert.equal(
            successorWritten(section, DECLARATION),
            ["## SUCCESSOR", "```", `${SUCCESSOR_FIELD} <name>`, "```", "", DECLARATION, "## NEXT"].join("\n"),
        );
        assert.equal(successorWritten("# no successor section", DECLARATION), null);
    });
});

describe("lastInheritedItem", () => {
    it("finds the last list item of the inherited section, and none without the banner or an item", () => {
        const lines = [
            "prose",
            INHERITED_BANNER,
            `${LIST_MARKER}first`,
            `${LIST_MARKER}second`,
            "═══════ POSITIONS",
            `${LIST_MARKER}not inherited`,
        ];
        assert.equal(lastInheritedItem(lines), 3);
        assert.equal(lastInheritedItem(["prose", `${LIST_MARKER}x`]), -1);
        assert.equal(lastInheritedItem([INHERITED_BANNER, "prose"]), -1);
    });
});
