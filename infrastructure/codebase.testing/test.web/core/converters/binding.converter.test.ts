import type { AnatomyFile, AnatomyFolder, AnatomyStats } from "@banes-lab/web/types/anatomy.types.ts";
import {
    bindingSitesOf,
    codeFilesOf,
    siteKey,
    siteTargetsOf,
} from "@banes-lab/web/core/converters/binding.converter.ts";
import { describe, expect, it } from "vitest";
import { codeReferencesOf } from "@banes-lab/web/core/converters/code.converter.ts";
import { definitionIndexOf } from "@banes-lab/web/core/converters/definition.converter.ts";

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

const file = function file(path: string, names: readonly string[], inherited = false): AnatomyFile {
    return {
        definitions: names.map((name, at) => ({
            callable: true,
            callees: [],
            callers: [],
            exported: true,
            file: path,
            flow: "isolated",
            id: `${path}::${name}`,
            inDegree: 0,
            kind: "lexical_declaration",
            line: at + 1,
            local: false,
            name,
            outDegree: 0,
        })),
        distribution: { invariants: [], variants: [] },
        document: null,
        findings: [],
        generated: false,
        id: path,
        inherited,
        layer: null,
        name: path,
        path,
        slots: null,
        source: null,
        stats: STATS,
        walk: null,
    };
};

const folder = function folder(path: string, files: readonly AnatomyFile[]): AnatomyFolder {
    return {
        files,
        findings: [],
        folders: [],
        id: path,
        layer: null,
        name: path,
        path,
        role: "member",
        stats: STATS,
        walk: null,
    };
};

const SITE_FILE = "core/a.ts";
const BUILD_FILE = "build~core/b.ts";
const SITE = folder("", [file(SITE_FILE, ["alpha"]), file("tsconfig.base.json", [], true)]);
const BUILD = folder("build~", [file(BUILD_FILE, ["beta"])]);
const INDEX = definitionIndexOf([SITE, BUILD]);
const BETA = { column: 4, file: BUILD_FILE, line: 2, module: false, name: "beta", target: 1 };
const BUILD_MODULE = { kind: "file", path: BUILD_FILE };

const siteRoot = function siteRoot(tab: string): string | null {
    return tab === "tree" ? "/site" : null;
};

describe("codeFilesOf", () => {
    it("places each tree file under its tree root, and skips an inherited file and a tree with no root", () => {
        expect(codeFilesOf([SITE, BUILD], siteRoot)).toStrictEqual([
            { absolute: `/site/${SITE_FILE}`, path: SITE_FILE },
        ]);
    });
});

describe("bindingSitesOf and codeReferencesOf", () => {
    it("maps each binding to one shared target, preferring the definition the tree holds", () => {
        const local = { column: 8, file: SITE_FILE, line: 3, module: false, name: "value", target: 3 };
        const module = { column: 0, file: BUILD_FILE, line: 1, module: true, name: "b", target: 1 };
        const { sites, targets } = bindingSitesOf(INDEX, [BETA, { ...BETA, column: 9 }, local, module]);
        expect(targets).toStrictEqual([
            { kind: "definition", location: { file: BUILD_FILE, line: 1, name: "beta" } },
            { kind: "definition", location: { file: SITE_FILE, line: 3, name: "value" } },
            BUILD_MODULE,
        ]);
        expect(sites).toStrictEqual([2, 4, 0, 2, 9, 0, 3, 8, 1, 1, 0, 2]);
        const placed = siteTargetsOf({ sites: [...sites, 9, 9, 7], spans: {}, strings: {}, targets, words: {} });
        expect(placed.get(siteKey(3, 8))).toStrictEqual(targets[1]);
        expect(placed.get(siteKey(1, 0))).toStrictEqual(BUILD_MODULE);
        expect(placed.has(siteKey(9, 9))).toBe(false);
    });

    it("links code by its bindings alone, and prose by its words", () => {
        const lookups = {
            bindings: () => [BETA],
            records: new Set<string>(),
            ruleRecord: () => null,
            slotDeclaration: () => null,
        };
        const code = codeReferencesOf(INDEX, SITE_FILE, "alpha\n    beta;\n", false, lookups);
        expect(code.words).toStrictEqual({});
        expect(code.sites).toStrictEqual([2, 4, 0]);
        const prose = codeReferencesOf(INDEX, "core/a.json", '"alpha"', false);
        expect(prose.words["alpha"]?.kind).toBe("definition");
        expect(prose.sites).toStrictEqual([]);
    });
});
