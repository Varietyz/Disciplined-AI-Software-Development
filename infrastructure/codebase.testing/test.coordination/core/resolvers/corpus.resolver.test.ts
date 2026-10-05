import { describe, it } from "vitest";
import {
    keyFromSymbol,
    nameParts,
    rawFacetOf,
    symbolOf,
} from "coordination-surface/tools/core/resolvers/corpus.resolver.ts";
import assert from "node:assert/strict";
import { readDocument } from "coordination-surface/tools/core/readers/document.reader.ts";

const CONFIG = { facetByValue: {}, facetFields: ["kind", "type"], filedUnder: "", variantByOrigin: {} };

describe("nameParts and keyFromSymbol", () => {
    it("split a name on dots keeping empty parts, and turn a symbol into a kebab key", () => {
        assert.deepEqual(nameParts("board.rule.ts"), ["board", "rule", "ts"]);
        assert.deepEqual(nameParts(".hidden"), ["", "hidden"]);
        assert.equal(keyFromSymbol("LOST_UPDATE"), "lost-update");
    });
});

describe("rawFacetOf and symbolOf", () => {
    it("read the first non-empty facet field in declared order, and the first heading as the symbol", () => {
        const document = readDocument("a.md", "---\nkind:\ntype: finding\n---\n\n# LOST_UPDATE\n# second");
        assert.equal(rawFacetOf(document, CONFIG), "finding");
        assert.equal(symbolOf(document), "LOST_UPDATE");
        const bare = readDocument("b.md", "prose only");
        assert.equal(rawFacetOf(bare, CONFIG), null);
        assert.equal(symbolOf(bare), null);
    });
});
