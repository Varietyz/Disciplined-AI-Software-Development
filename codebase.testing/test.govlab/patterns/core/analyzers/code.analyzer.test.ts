import { call, definition } from "./code.fixture.ts";
import { codeGraph, codeInsight } from "@govlab/patterns/core/analyzers/code.analyzer.ts";
import { describe, expect, it } from "vitest";

const symbols = [
    definition("caller", "a.ts"),
    call("callee", "caller", "a.ts"),
    call("external", "caller", "a.ts"),
    definition("callee", "b.ts"),
];

describe("codeGraph", () => {
    it("resolves a call to its unique definition and records an unknown name as external", () => {
        const graph = codeGraph(symbols);
        expect(graph.edges).toStrictEqual([{ file: "a.ts", from: "a.ts::caller", line: 1, to: "b.ts::callee" }]);
        expect(graph.external.map((entry) => entry.name)).toStrictEqual(["external"]);
    });
});

describe("codeInsight", () => {
    it("reads each definition's flow from its degrees", () => {
        const insight = codeInsight(symbols, []);
        expect(insight.definitions).toBe(2);
        expect(insight.edges).toBe(1);
        expect(insight.symbols.map((stat) => [stat.name, stat.flow])).toStrictEqual([
            ["callee", "leaf"],
            ["caller", "entry"],
        ]);
    });

    it("marks a definition inside another definition as local and one at module scope as not", () => {
        const nested = { ...definition("inner", "a.ts"), enclosing: "caller" };
        const insight = codeInsight([definition("caller", "a.ts"), nested], []);
        expect(insight.symbols.map((stat) => [stat.name, stat.local])).toStrictEqual([
            ["caller", false],
            ["inner", true],
        ]);
    });
});
