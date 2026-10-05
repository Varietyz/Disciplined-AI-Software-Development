import { basename, join } from "node:path";
import {
    buildPackageMap,
    discoverModules,
    sourceFiles,
    testFilesOf,
} from "@govlab/patterns/core/loaders/package.loader.ts";
import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const MANIFEST = { label: "m", maturity: "stable", visibility: {} };

const seed = function seed(): string {
    const root = mkdtempSync(join(tmpdir(), "pl-packages-"));
    for (const name of ["alpha", "beta"]) {
        mkdirSync(join(root, name, "core"), { recursive: true });
        writeVerbatim(join(root, name, "_manifest.json"), JSON.stringify(MANIFEST));
        writeVerbatim(join(root, name, "package.json"), JSON.stringify({ name: `@scope/${name}` }));
        writeVerbatim(join(root, name, "core", "run.ts"), "export const run = 1;\n");
        writeVerbatim(join(root, name, "core", "run.test.ts"), "run;\n");
    }
    mkdirSync(join(root, "skip"));
    writeVerbatim(join(root, "skip", "_manifest.json"), JSON.stringify(MANIFEST));
    return root;
};

const pruned = function pruned(folder: string): boolean {
    return basename(folder) === "skip";
};

describe("the package loader", () => {
    const root = seed();

    it("discovers every shaped manifest outside a pruned folder", () => {
        expect(discoverModules(root, pruned).map((dir) => dir.slice(root.length + 1))).toStrictEqual(["alpha", "beta"]);
    });

    it("maps each package name to its folder", () => {
        const map = buildPackageMap(discoverModules(root, pruned));
        expect([...map.keys()]).toStrictEqual(["@scope/alpha", "@scope/beta"]);
    });

    it("splits a module's code into sources and tests", () => {
        const alpha = join(root, "alpha");
        expect(sourceFiles(alpha, pruned).map((file) => file.slice(alpha.length + 1))).toStrictEqual([
            join("core", "run.ts"),
        ]);
        expect(testFilesOf(alpha, pruned).map((file) => file.slice(alpha.length + 1))).toStrictEqual([
            join("core", "run.test.ts"),
        ]);
    });
});
