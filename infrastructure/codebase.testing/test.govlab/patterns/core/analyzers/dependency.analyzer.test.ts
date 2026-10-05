import {
    callCycleFindings,
    findStronglyConnected,
    moduleImportCycleFindings,
} from "@govlab/patterns/core/analyzers/dependency.analyzer.ts";
import { describe, expect, it } from "vitest";

describe("findStronglyConnected", () => {
    it("groups mutually reachable nodes and leaves an acyclic node alone", () => {
        const sccs = findStronglyConnected(
            new Map([
                ["a", ["b"]],
                ["b", ["a"]],
                ["c", []],
            ]),
            ["a", "b", "c"],
        );
        expect(sccs.map((scc) => scc.toSorted((x, y) => x.localeCompare(y)))).toContainEqual(["a", "b"]);
        expect(sccs).toContainEqual(["c"]);
    });
});

describe("callCycleFindings", () => {
    it("reports a cycle that spans files and ignores one inside a single file", () => {
        const across = callCycleFindings([
            { from: "a.ts::x", to: "b.ts::y" },
            { from: "b.ts::y", to: "a.ts::x" },
        ]);
        expect(across.map((finding) => finding.members)).toStrictEqual([["a.ts::x", "b.ts::y"]]);
        const within = callCycleFindings([
            { from: "a.ts::x", to: "a.ts::y" },
            { from: "a.ts::y", to: "a.ts::x" },
        ]);
        expect(within).toStrictEqual([]);
    });
});

describe("moduleImportCycleFindings", () => {
    it("flags every module of an import cycle", () => {
        const cycles = moduleImportCycleFindings(
            [
                { from: "a", to: "b" },
                { from: "b", to: "a" },
            ],
            (dir) => dir,
        );
        expect(cycles.get("a")?.[0]?.kind).toBe("import-cycle");
        expect(cycles.get("b")?.[0]?.members).toStrictEqual(["a", "b"]);
    });
});
