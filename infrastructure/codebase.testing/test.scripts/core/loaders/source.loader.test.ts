import { describe, expect, it } from "vitest";
import { includedFilesUnder, sourceFilesUnder } from "@project/scripts/core/loaders/source.loader.ts";
import { mkdirSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const tree = function tree(): string {
    const root = mkdtempSync(join(tmpdir(), "source-"));
    mkdirSync(join(root, "core"));
    mkdirSync(join(root, "node_modules"));
    writeVerbatim(join(root, "core", "a.ts"), "");
    writeVerbatim(join(root, "core", "a.d.ts"), "");
    writeVerbatim(join(root, "core", "page.html"), "");
    writeVerbatim(join(root, "core", "site.css"), "");
    writeVerbatim(join(root, "node_modules", "vendor.css"), "");
    return root;
};

describe("sourceFilesUnder", () => {
    it("lists the TypeScript sources and leaves declaration files out", () => {
        const root = tree();
        expect(sourceFilesUnder(join(root, "core"))).toStrictEqual([join(root, "core", "a.ts")]);
    });
});

describe("includedFilesUnder", () => {
    it("lists the files of the named extensions, outside every excluded folder", () => {
        const root = tree();
        const found = includedFilesUnder(root, new Set([".css", ".html"])).toSorted();
        expect(found).toStrictEqual([join(root, "core", "page.html"), join(root, "core", "site.css")].toSorted());
    });
});
