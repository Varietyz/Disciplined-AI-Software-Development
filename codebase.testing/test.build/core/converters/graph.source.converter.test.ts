import type { AnatomyFile, AnatomyFolder, AnatomyStats, DefinitionView } from "@banes-lab/web/types/anatomy.types.ts";
import { describe, expect, it } from "vitest";
import type { SourceTree } from "@banes-lab/build-scripts/types/source.types.ts";
import { VOCABULARY } from "./graph.fixture.ts";
import { danglingEdges } from "@banes-lab/build-scripts/core/converters/graph.converter.ts";
import { sourceGraph } from "@banes-lab/build-scripts/core/converters/graph.source.converter.ts";

const STATS: AnatomyStats = {
    bytes: 0,
    callable: 0,
    definitions: 0,
    edges: 0,
    exported: 0,
    files: 0,
    findings: {},
    flows: {},
    lines: { blank: 0, code: 0, total: 0 },
};

const definition = function definition(id: string, callees: readonly string[]): DefinitionView {
    return {
        callable: true,
        callees: callees.map((callee) => ({ file: "a.ts", id: callee, name: callee })),
        callers: [],
        exported: true,
        file: "a.ts",
        flow: "flow",
        id,
        inDegree: 0,
        kind: "function",
        line: 1,
        local: false,
        name: id,
        outDegree: callees.length,
    };
};

const FILE: AnatomyFile = {
    definitions: [definition("run", ["help"]), definition("help", [])],
    distribution: { invariants: [], variants: [] },
    document: null,
    findings: [],
    generated: false,
    id: "a",
    inherited: false,
    layer: null,
    name: "a.ts",
    path: "core/a.ts",
    slots: null,
    source: null,
    stats: STATS,
    walk: null,
};

const folder = function folder(
    path: string,
    files: readonly AnatomyFile[],
    folders: readonly AnatomyFolder[],
): AnatomyFolder {
    return {
        files,
        findings: [],
        folders,
        id: path,
        layer: null,
        name: path,
        path,
        role: "concern",
        stats: STATS,
        walk: null,
    };
};

const TREE: SourceTree = {
    label: "Site tree",
    snapshot: {
        charts: [],
        findings: [],
        imports: [],
        metrics: {
            callable: 0,
            definitions: 0,
            edges: 0,
            exported: 0,
            findings: {},
            flows: {},
            maxInDegree: 0,
            maxOutDegree: 0,
            resolutionRate: 1,
            unresolvedCalls: 0,
        },
        states: [],
        tree: folder("", [], [folder("core", [FILE], [])]),
        unresolvedCalls: [],
    },
    tab: "tree",
};

const IDS = {
    fileId: (path: string) => `file-${path}`,
    folderHref: (path: string) => `/anatomy#folder-${path}`,
    folderId: (path: string) => `folder-${path}`,
    localPath: (path: string) => path,
    nodeHref: (file: string, line: number | null) => `/anatomy#file-${file}:${String(line)}`,
};

describe("sourceGraph", () => {
    it("emits folder, file and definition nodes with containment and call edges", () => {
        const graph = sourceGraph([TREE], IDS, VOCABULARY);
        expect(graph.nodes.map((held) => `${held.kind} ${held.ref}`)).toStrictEqual([
            "folder anatomy:folder-",
            "folder anatomy:folder-core",
            "file anatomy:file-core/a.ts",
            "definition anatomy:run",
            "definition anatomy:help",
        ]);
        expect(graph.edges).toContainEqual({
            from: "anatomy:folder-",
            relation: "contains",
            to: "anatomy:folder-core",
        });
        expect(graph.edges).toContainEqual({ from: "anatomy:run", relation: "calls", to: "anatomy:help" });
        expect(graph.nodes.every((held) => held.layer === "source:tree")).toBe(true);
        expect(graph.nodes.find((held) => held.ref === "anatomy:folder-core")?.href).toBe("/anatomy#folder-core");
        expect(graph.nodes.find((held) => held.ref === "anatomy:run")?.href).toBe("/anatomy#file-core/a.ts:1");
        expect(danglingEdges(graph)).toStrictEqual([]);
    });
});
