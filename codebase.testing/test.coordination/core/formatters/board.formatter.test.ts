import {
    AT_FIELD,
    CITES_FIELD,
    KIND_FIELD,
    addresseesOf,
    citationStamp,
    citedSurfaces,
    fencedItem,
    isItemId,
    itemKindOf,
    nextOrdinal,
    stampOf,
    stampedCitations,
} from "coordination-surface/tools/core/formatters/board.formatter.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("isItemId", () => {
    it("accepts a capital letter key, a hyphen and digits, and nothing else", () => {
        assert.equal(isItemId("A-12"), true);
        assert.equal(isItemId("AB-3"), true);
        assert.equal(isItemId("a-1"), false);
        assert.equal(isItemId("A-"), false);
        assert.equal(isItemId("-1"), false);
        assert.equal(isItemId("A-1x"), false);
    });
});

describe("nextOrdinal", () => {
    it("allocates one past the highest ordinal the agent used on any surface or in the archive", () => {
        const board = "┌─── AGENT A-2 ───\nbody\n└─── END AGENT A-2\n┌─── AGENT B-9 ───";
        assert.equal(nextOrdinal([board], "A", "archived A-5 and A-3"), 6);
        assert.equal(nextOrdinal([board], "A", ""), 3);
        assert.equal(nextOrdinal([], "C", ""), 1);
    });
});

describe("addresseesOf", () => {
    it("reads the seat letters the opener names, through AND and punctuation, up to the first other word", () => {
        assert.deepEqual(addresseesOf("To A, B and C: please review D"), ["A", "B", "C"]);
        assert.deepEqual(addresseesOf("To ALL agents"), []);
        assert.deepEqual(addresseesOf("Note for A"), []);
    });
});

describe("itemKindOf and stampOf", () => {
    it("reads the kind and the timestamp from an item's opening marker", () => {
        const source = `  ┌─── AGENT A-1 ─── ${KIND_FIELD}judgment ${AT_FIELD}1700 to:B`;
        assert.equal(itemKindOf(source, "A-1"), "judgment");
        assert.equal(itemKindOf(source, "A-2"), "");
        assert.equal(stampOf(source), 1700);
        assert.equal(stampOf("no stamp here"), 0);
    });
});

describe("citations", () => {
    it("reads each cited surface once from backticked reference lines", () => {
        const text = "`model`: `models/a.model.md`\n`model`: `models/a.model.md`\n`bad`: `two words`\nprose";
        assert.deepEqual(citedSurfaces(text), ["models/a.model.md"]);
    });

    it("writes a citation stamp and reads it back, skipping malformed entries", () => {
        const cited = [
            { at: 10, path: "models/a.model.md" },
            { at: 20, path: "roles/b.role.md" },
        ];
        const stamp = citationStamp(cited);
        assert.equal(stamp, ` ${CITES_FIELD}models/a.model.md@10,roles/b.role.md@20`);
        assert.deepEqual(stampedCitations(`marker${stamp} more`), cited);
        assert.deepEqual(stampedCitations(`${CITES_FIELD}@5,path@x`), []);
        assert.equal(citationStamp([]), "");
    });
});

describe("fencedItem", () => {
    it("fences the text between an opening marker carrying its metadata and a closing marker", () => {
        const lines = fencedItem("A-3", "To B and C — read this.", 42, "artifact");
        assert.equal(lines[0]?.includes(`┌─── AGENT A-3 ─── ${KIND_FIELD}artifact ${AT_FIELD}42 to:B,C`), true);
        assert.equal(lines.at(-1)?.trim(), "└─── END AGENT A-3");
        assert.equal(lines.length, 3);
    });

    it("addresses everyone when the text names no seat, and keeps blank lines", () => {
        const lines = fencedItem("A-4", "first\n\nsecond", 1, "judgment");
        assert.equal(lines[0]?.endsWith("to:*"), true);
        assert.deepEqual(
            lines.slice(1, -1).map((line) => line.trim()),
            ["first", "", "second"],
        );
    });
});
