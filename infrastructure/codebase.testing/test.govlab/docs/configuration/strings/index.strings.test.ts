import {
    composeLine,
    composesPeers,
    concernRow,
    groupRow,
    indexSummary,
    indexedCount,
    inventoryRow,
    regeneratedIndex,
    reproduceNote,
    standaloneLine,
    upToDate,
    wroteFile,
} from "@govlab/docs/configuration/strings/index.strings.ts";
import { describe, expect, it } from "vitest";
import { unmatched } from "./strings.fixture.ts";

describe("the index strings", () => {
    it("carry every operand they are given", () => {
        const row = inventoryRow({ exports: 4, group: "utils", loc: 90, name: "mod", siblings: "a", sources: 3 });
        const summary = indexSummary({ composers: 1, exports: 20, leaves: 5, loc: 900, packages: 6 });
        expect(
            unmatched([
                [reproduceNote("index.entrypoint.ts"), "`index.entrypoint.ts`"],
                [composesPeers(3), "composes 3 peers"],
                [row, "| `mod` | utils | a | 4 exports | 3 | 90 |"],
                [concernRow("docs", "mod"), "| docs | `mod` |"],
                [groupRow("utils", "role", 2), "| `utils` | role | 2 |"],
                [summary, "**6 packages**"],
                [composeLine("mod", "a, b"), "`mod`"],
                [standaloneLine("mod", "purpose"), "`mod` — purpose"],
                [regeneratedIndex("a.md", "a.json"), "a.md / a.json"],
                [upToDate("a.md"), "a.md up to date"],
                [wroteFile("a.md"), "Wrote a.md"],
                [indexedCount(6, 2), "6 packages across 2 groups"],
            ]),
        ).toStrictEqual([]);
    });
});
