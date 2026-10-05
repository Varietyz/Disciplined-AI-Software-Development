import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { analyzer } from "@govlab/docs/core/plugins/code.go.plugin.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const GO_SOURCE = [
    "package main",
    "",
    "func helper() int {",
    "\treturn 1",
    "}",
    "",
    "func Run() int {",
    "\treturn helper()",
    "}",
    "",
    "func main() {",
    "\tRun()",
    "}",
    "",
].join("\n");

const moduleDir = mkdtempSync(join(tmpdir(), "doc-go-"));
writeVerbatim(join(moduleDir, "go.mod"), "module example.com/demo\n\ngo 1.22\n");
writeVerbatim(join(moduleDir, "main.go"), GO_SOURCE);
const emptyDir = mkdtempSync(join(tmpdir(), "doc-go-empty-"));

afterAll(() => {
    rmSync(moduleDir, { force: true, recursive: true });
    rmSync(emptyDir, { force: true, recursive: true });
});

describe("the Go analyzer", () => {
    it("claims only a folder with a module file", () => {
        expect(analyzer.canAnalyze(moduleDir)).toBe(true);
        expect(analyzer.canAnalyze(emptyDir)).toBe(false);
    });

    it("derives entry nodes and call edges traced to source", () => {
        const graph = analyzer.analyze({ moduleDir, pkg: {}, recognizers: [] });
        expect(graph?.nodes.some((node) => node.kind === "entry")).toBe(true);
        expect(graph?.edges.some((edge) => edge.kind === "call")).toBe(true);
        expect(graph?.nodes.every((node) => node.source.file.length > 0 && node.source.line >= 1)).toBe(true);
    });

    it("yields nothing for a folder without Go sources", () => {
        expect(analyzer.analyze({ moduleDir: emptyDir, pkg: {}, recognizers: [] })).toBeNull();
    });
});
