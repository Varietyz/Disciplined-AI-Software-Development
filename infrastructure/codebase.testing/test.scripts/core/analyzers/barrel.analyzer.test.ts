import { afterAll, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { collectGlobEdges } from "@project/scripts/core/analyzers/barrel.analyzer.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "closure-globs-"));

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

const seed = function seed(name: string, barrel: string, variants: readonly string[]): string {
    const dir = join(root, name);
    const variantDir = join(dir, "variants");
    mkdirSync(variantDir, { recursive: true });
    for (const variant of variants) {
        writeVerbatim(join(variantDir, variant), "export const value = 1;\n");
    }
    const barrelPath = join(dir, "index.ts");
    writeVerbatim(barrelPath, barrel);
    return barrelPath;
};

describe("collectGlobEdges", () => {
    it("resolves a glob barrel to one edge per file it collects", () => {
        const barrel = seed(
            "resolves",
            'const modules = import.meta.glob("./variants/*.ts");\nexport default modules;\n',
            ["a.ts", "b.ts"],
        );
        const edges = collectGlobEdges(root, [barrel]);
        expect(edges.map((edge) => edge.from).sort((a, b) => a.localeCompare(b))).toStrictEqual([
            "./variants/a.ts",
            "./variants/b.ts",
        ]);
    });

    it("anchors every edge at the barrel that declared it", () => {
        const barrel = seed("anchored", 'export default import.meta.glob("./variants/*.ts");\n', ["a.ts"]);
        expect(collectGlobEdges(root, [barrel])[0]?.file).toBe("anchored/index.ts");
    });

    it("crosses a recursive segment, so a nested variant is still collected", () => {
        const dir = join(root, "deep");
        mkdirSync(join(dir, "variants", "nested"), { recursive: true });
        writeVerbatim(join(dir, "variants", "nested", "c.ts"), "export const value = 1;\n");
        const barrel = join(dir, "index.ts");
        writeVerbatim(barrel, 'export default import.meta.glob("./variants/**/*.ts");\n');
        expect(collectGlobEdges(root, [barrel]).map((edge) => edge.from)).toStrictEqual(["./variants/nested/c.ts"]);
    });

    it("collects nothing from a file that declares no glob", () => {
        const barrel = seed("plain", "export const value = 1;\n", ["a.ts"]);
        expect(collectGlobEdges(root, [barrel])).toStrictEqual([]);
    });

    it("throws on a pattern that matches nothing, because a barrel collecting nothing registers nothing", () => {
        const barrel = seed("empty", 'export default import.meta.glob("./variants/*.missing.ts");\n', ["a.ts"]);
        expect(() => collectGlobEdges(root, [barrel])).toThrow("match no files");
    });

    it("ignores a non-relative pattern, which names no file in this tree", () => {
        const barrel = seed("bare", 'export default import.meta.glob("variants/*.ts");\n', ["a.ts"]);
        expect(collectGlobEdges(root, [barrel])).toStrictEqual([]);
    });
});
