import {
    buildImportGraph,
    computeDeadExports,
    findEntrypoints,
    walkReachable,
} from "@ssot/govlab/shared/analyzers/liveness.analyzer.ts";
import { describe, expect, it } from "vitest";
import type { ClosureGraph } from "@ssot/govlab/types/closure.types.ts";

const ENTRY = "site.entrypoint.ts";
const LIVE = "element.factory.ts";
const DEAD = "orphan.factory.ts";

const GRAPH: ClosureGraph = {
    consumers: [],
    emits: [],
    eventActivity: [],
    exports: [
        { file: LIVE, name: "createElement" },
        { file: LIVE, name: "unusedHelper" },
        { file: DEAD, name: "orphan" },
    ],
    externalConsumers: [],
    iconsExports: [],
    idsExports: [],
    imports: [{ file: ENTRY, from: `./${LIVE}`, names: ["createElement"] }],
    interfaces: [],
    registers: [],
    sideEffectImports: [],
    stringsExports: [],
    subscribes: [],
    version: 1,
};

describe("buildImportGraph, findEntrypoints and walkReachable", () => {
    const graph = buildImportGraph(GRAPH);
    const entrypoints = findEntrypoints(GRAPH, [".entrypoint.ts"], []);

    it("builds edges from the closure's imports and seeds the walk from the entrypoint files", () => {
        expect(graph.get(ENTRY)?.[0]?.target).toBe(LIVE);
        expect([...entrypoints]).toStrictEqual([ENTRY]);
    });

    it("reaches the imported export and the file it lives in, and nothing else", () => {
        const reached = walkReachable(entrypoints, graph);
        expect(reached.reachableFiles.has(LIVE)).toBe(true);
        expect(reached.reachableExports.has(`${LIVE}::createElement`)).toBe(true);
        expect(reached.reachableExports.has(`${LIVE}::unusedHelper`)).toBe(false);
    });
});

describe("computeDeadExports", () => {
    it("reports every export no entrypoint reaches, honoring the allowlist predicate", () => {
        const dead = computeDeadExports(GRAPH, [".entrypoint.ts"], [], (key) => key.endsWith("::orphan"));
        expect(dead.map((entry) => entry.name)).toStrictEqual(["unusedHelper"]);
    });
});
