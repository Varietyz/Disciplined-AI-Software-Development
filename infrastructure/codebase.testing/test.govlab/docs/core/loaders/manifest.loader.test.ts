import { afterAll, describe, expect, it } from "vitest";
import {
    declaredEntries,
    discoverManifests,
    discoverModules,
    manifestBarrels,
    readManifest,
    readPackageJson,
    unresolvedEntryPatterns,
} from "@govlab/docs/core/loaders/manifest.loader.ts";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const SHAPED = { label: "My Mod", maturity: "stable", visibility: { hidden: false, private: false } };

const moduleRoot = mkdtempSync(join(tmpdir(), "doclab-module-"));
writeVerbatim(join(moduleRoot, "_manifest.json"), JSON.stringify({ ...SHAPED, entries: ["index.ts", "missing/*.ts"] }));
writeVerbatim(
    join(moduleRoot, "package.json"),
    JSON.stringify({ dependencies: { a: "1", b: 2 }, exports: { ".": { default: "x" } }, name: "m" }),
);
writeVerbatim(join(moduleRoot, "index.ts"), "");

const tree = mkdtempSync(join(tmpdir(), "doclab-tree-"));
mkdirSync(join(tree, "mymod"));
mkdirSync(join(tree, "other"));
writeVerbatim(join(tree, "mymod", "_manifest.json"), JSON.stringify(SHAPED));
writeVerbatim(join(tree, "other", "_manifest.json"), JSON.stringify({ label: "no maturity" }));

afterAll(() => {
    rmSync(moduleRoot, { force: true, recursive: true });
    rmSync(tree, { force: true, recursive: true });
});

describe("readManifest and readPackageJson", () => {
    it("read the typed fields and fall back to empty records", () => {
        expect(readManifest(moduleRoot)["label"]).toBe("My Mod");
        expect(readPackageJson(moduleRoot)).toStrictEqual({
            dependencies: { a: "1" },
            exports: { ".": { default: "x" } },
            name: "m",
        });
        expect(readManifest(join(moduleRoot, "absent"))).toStrictEqual({});
    });
});

describe("discoverManifests and discoverModules", () => {
    it("find a docs-shaped manifest under any root and ignore an unshaped one", () => {
        expect(discoverManifests(tree).map((module) => [module.slug, module.group])).toStrictEqual([
            ["mymod", "mymod"],
        ]);
    });

    it("tag each workspace module with its ecosystem", () => {
        expect(discoverModules().every((module) => typeof module.ecosystemHint === "string")).toBe(true);
    });
});

describe("the declared entries", () => {
    it("expand the declared patterns and report one that matches nothing", () => {
        expect(declaredEntries(moduleRoot)).toStrictEqual(["index.ts", "missing/*.ts"]);
        expect(manifestBarrels(moduleRoot)).toStrictEqual([join(moduleRoot, "index.ts")]);
        expect(unresolvedEntryPatterns(moduleRoot)).toStrictEqual(["missing/*.ts"]);
    });

    it("tell an absent declaration from an explicitly empty one", () => {
        expect(declaredEntries(absolutePath("govlab.context"))).toBeNull();
        expect(declaredEntries(absolutePath("codebase.testing"))).toStrictEqual([]);
    });
});
