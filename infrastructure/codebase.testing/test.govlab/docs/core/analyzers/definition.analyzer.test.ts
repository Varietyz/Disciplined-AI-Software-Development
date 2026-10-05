import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { deriveTypeGraph } from "@govlab/docs/core/analyzers/definition.analyzer.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const dir = mkdtempSync(join(tmpdir(), "doc-types-"));
writeVerbatim(
    join(dir, "index.ts"),
    [
        "export interface Base { id: string }",
        "export interface Options { base: Base }",
        "export class Impl implements Base { id = ''; run(): void {} }",
    ].join("\n"),
);
const empty = mkdtempSync(join(tmpdir(), "doc-types-empty-"));

afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
    rmSync(empty, { force: true, recursive: true });
});

describe("deriveTypeGraph", () => {
    it("reads the exported types with their heritage and reference edges", () => {
        const graph = deriveTypeGraph(dir, {});
        expect(
            graph.nodes.map((node) => node.label).toSorted((left, right) => left.localeCompare(right)),
        ).toStrictEqual(["Base", "Impl", "Options"]);
        expect(graph.edges.map((edge) => edge.kind).toSorted((left, right) => left.localeCompare(right))).toStrictEqual(
            ["has", "implements"],
        );
    });

    it("yields an empty graph for a module with no barrel", () => {
        expect(deriveTypeGraph(empty, {})).toStrictEqual({ edges: [], nodes: [] });
    });
});
