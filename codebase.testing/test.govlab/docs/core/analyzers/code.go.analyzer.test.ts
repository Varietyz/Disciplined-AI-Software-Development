import { afterAll, describe, expect, it } from "vitest";
import { basename, join } from "node:path";
import { buildGoGraph, indexGoFiles } from "@govlab/docs/core/analyzers/code.go.analyzer.ts";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const dir = mkdtempSync(join(tmpdir(), "doc-go-index-"));
const FILE = join(dir, "main.go");
writeVerbatim(
    FILE,
    ["package main", "", "func loop() { loop() }", "", "func main() {", "\tloop()", "\tstore.Save()", "}", ""].join(
        "\n",
    ),
);

afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
});

describe("indexGoFiles", () => {
    it("indexes each function by name with the line it is declared on", () => {
        const index = indexGoFiles([FILE]);
        expect([...index.funcMap.keys()].toSorted((left, right) => left.localeCompare(right))).toStrictEqual([
            "loop",
            "main",
        ]);
        expect(index.funcMap.get("main")?.line).toBe(5);
    });
});

describe("buildGoGraph", () => {
    it("seeds from the entry and follows internal calls, loops and collaborators", () => {
        const graph = buildGoGraph(indexGoFiles([FILE]), (file) => basename(file)).result();
        expect(graph.nodes.map((node) => [node.kind, node.label])).toStrictEqual([
            ["entry", "main"],
            ["method", "loop"],
            ["collaborator", "store"],
        ]);
        expect(graph.edges.map((edge) => edge.kind)).toStrictEqual(["call", "call", "loop", "call"]);
        expect(graph.nodes[0]?.source.file).toBe("main.go");
    });
});
