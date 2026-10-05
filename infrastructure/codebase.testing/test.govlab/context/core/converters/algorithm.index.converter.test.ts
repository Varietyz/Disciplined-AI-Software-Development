import assert from "node:assert/strict";
import { buildSymbolIndex } from "@govlab/context/core/converters/algorithm.index.converter.ts";
import { test } from "vitest";

test("buildSymbolIndex classifies a double-quoted alternation as an enum with parsed values", () => {
    const entries = buildSymbolIndex([{ domain: "g", id: "r", productions: [{ lhs: "Status", rhs: '"a" | "b"' }] }]);
    assert.deepEqual(entries, [{ definedIn: ["r"], grammar: "g", kind: "enum", name: "Status", values: ["a", "b"] }]);
});

test("buildSymbolIndex classifies a production containing a nonterminal as composite, keeping its right-hand side", () => {
    const entries = buildSymbolIndex([{ domain: "g", id: "r", productions: [{ lhs: "Node", rhs: "<expr> '+'" }] }]);
    assert.deepEqual(entries, [{ definedIn: ["r"], grammar: "g", kind: "composite", name: "Node", rhs: "<expr> '+'" }]);
});

test("buildSymbolIndex keeps the same symbol name apart per grammar", () => {
    const entries = buildSymbolIndex([
        { domain: "g1", id: "r1", productions: [{ lhs: "Status", rhs: "<x>" }] },
        { domain: "g2", id: "r2", productions: [{ lhs: "Status", rhs: "<y>" }] },
    ]);
    assert.deepEqual(
        entries.map((entry) => entry.grammar),
        ["g1", "g2"],
    );
});

test("buildSymbolIndex sorts entries by grammar then name", () => {
    const entries = buildSymbolIndex([
        { domain: "zeta", id: "r1", productions: [{ lhs: "Beta", rhs: "<x>" }] },
        {
            domain: "alpha",
            id: "r2",
            productions: [
                { lhs: "Delta", rhs: "<x>" },
                { lhs: "Charlie", rhs: "<y>" },
            ],
        },
    ]);
    assert.deepEqual(
        entries.map((entry) => `${entry.grammar}/${entry.name}`),
        ["alpha/Charlie", "alpha/Delta", "zeta/Beta"],
    );
});

test("buildSymbolIndex picks the sorted-first right-hand side and unions the defining records", () => {
    const entries = buildSymbolIndex([
        { domain: "g", id: "r1", productions: [{ lhs: "N", rhs: "<b>" }] },
        { domain: "g", id: "r2", productions: [{ lhs: "N", rhs: "<a>" }] },
    ]);
    assert.equal(entries.length, 1);
    const [entry] = entries;
    assert.ok(entry !== undefined);
    assert.equal(entry.rhs, "<a>");
    assert.deepEqual(entry.definedIn, ["r1", "r2"]);
});

test("buildSymbolIndex on empty input yields an empty index", () => {
    assert.deepEqual(buildSymbolIndex([]), []);
});
