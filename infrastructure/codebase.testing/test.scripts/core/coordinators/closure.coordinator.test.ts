import { ZONE, memberFixture } from "../analyzers/closure.fixture.ts";
import { buildClosureGraph, graphCounts } from "@project/scripts/core/coordinators/closure.coordinator.ts";
import { describe, expect, it } from "vitest";

const CALLER = `${ZONE}/c.ts`;
const IDENT = { kind: "ident", text: "A_ID" };

describe("buildClosureGraph and graphCounts", () => {
    const graph = buildClosureGraph(memberFixture());

    it("records the registers, consumers and events a file declares, keyed relative to the member", () => {
        expect(graph.registers.map((entry) => [entry.file, entry.fn])).toStrictEqual([[CALLER, "registerThing"]]);
        expect(graph.consumers.map((entry) => entry.fn)).toStrictEqual(["getThing", "emitEvent"]);
        expect(graph.emits).toStrictEqual([{ eventArg: IDENT, file: CALLER }]);
        expect(graph.subscribes).toStrictEqual([{ eventArg: IDENT, file: CALLER }]);
    });

    it("sorts exports into the ids and strings sets by their concern suffix, and skips test files", () => {
        expect(graph.idsExports.map((entry) => entry.name)).toStrictEqual(["A_ID"]);
        expect(graph.stringsExports.map((entry) => entry.name)).toStrictEqual(["LABEL"]);
        expect(graph.exports.some((entry) => entry.name === "skipped")).toBe(false);
        expect(graph.exports.some((entry) => entry.name === "run")).toBe(true);
    });

    it("resolves a self import and a dynamic import to a relative specifier with its extension", () => {
        const fromCaller = graph.imports.filter((entry) => entry.file === CALLER);
        expect(fromCaller.map((entry) => [entry.from, entry.names])).toStrictEqual([
            ["./a.ids.ts", ["A_ID"]],
            ["./b.strings.ts", ["LABEL"]],
        ]);
    });

    it("records interface fields and the edges a glob barrel creates", () => {
        expect(graph.interfaces).toStrictEqual([
            {
                fields: [
                    { name: "name", optional: false },
                    { name: "age", optional: true },
                ],
                file: CALLER,
                name: "Shape",
            },
        ]);
        expect(graph.sideEffectImports).toContainEqual({ file: `${ZONE}/index.ts`, from: "./a.ids.ts" });
    });

    it("counts each set under a readable label", () => {
        const counts = graphCounts(graph);
        expect(counts["id consts"]).toBe(1);
        expect(counts.strings).toBe(1);
        expect(counts.registers).toBe(1);
    });
});
