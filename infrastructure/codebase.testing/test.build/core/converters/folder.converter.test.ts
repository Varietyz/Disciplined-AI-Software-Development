import type { AnatomyFile, AnatomyFolder, AnatomySnapshot } from "@banes-lab/web/types/anatomy.types.js";
import { describe, expect, it } from "vitest";
import type { Identity } from "@banes-lab/build-scripts/types/catalog.types.ts";
import { createLinker } from "@banes-lab/build-scripts/core/resolvers/link.resolver.ts";
import { folderRelations } from "@banes-lab/build-scripts/core/converters/folder.converter.ts";

const SITE = "https://example.test";
const STATS = {
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

const file = function file(path: string): AnatomyFile {
    return {
        definitions: [],
        distribution: { invariants: [], variants: [] },
        document: null,
        findings: [],
        generated: false,
        id: path,
        inherited: false,
        layer: null,
        name: path,
        path,
        slots: null,
        source: null,
        stats: STATS,
        walk: null,
    };
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

const EMPTY_METRICS = {
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
};

const snapshot = function snapshot(tree: AnatomyFolder): AnatomySnapshot {
    return { charts: [], findings: [], imports: [], metrics: EMPTY_METRICS, states: [], tree, unresolvedCalls: [] };
};

const identity = function identity(ref: string, href: string | null, title: string): Identity {
    return { address: { json: `/json/${title}`, markdown: null }, href, kind: "section", ref, summary: null, title };
};

const TOOLS = {
    fileId: (path: string) => `file-${path}`,
    folderHref: (path: string) => `/anatomy/tree#folder-${path === "" ? "root" : path}`,
};

describe("folderRelations", () => {
    it("lists a folder's child folders and files, and names the folder that contains it", () => {
        const tree = folder("", [file("a.ts")], [folder("core", [file("core-b.ts")], [])]);
        const linker = createLinker(
            [
                identity("chapter:/anatomy/tree#folder-root", "/anatomy/tree#folder-root", "root"),
                identity("chapter:/anatomy/tree#folder-core", "/anatomy/tree#folder-core", "core"),
                identity("anatomy:file-a.ts", null, "a.ts"),
                identity("anatomy:file-core-b.ts", null, "core-b.ts"),
            ],
            SITE,
            (href) => href,
        );
        const relations = folderRelations([{ label: "Site", snapshot: snapshot(tree), tab: "tree" }], TOOLS, linker);
        const root = relations.get("chapter:/anatomy/tree#folder-root");
        const core = relations.get("chapter:/anatomy/tree#folder-core");
        expect(root?.containedIn).toBeNull();
        expect(root?.contains.map((link) => link.ref)).toStrictEqual([
            "chapter:/anatomy/tree#folder-core",
            "anatomy:file-a.ts",
        ]);
        expect(core?.containedIn?.ref).toBe("chapter:/anatomy/tree#folder-root");
        expect(core?.contains.map((link) => link.label)).toStrictEqual(["core-b.ts"]);
        expect(relations.get("anatomy:file-a.ts")?.containedIn?.ref).toBe("chapter:/anatomy/tree#folder-root");
        const nested = relations.get("anatomy:file-core-b.ts");
        expect(nested?.containedIn?.ref).toBe("chapter:/anatomy/tree#folder-core");
        expect(nested?.contains).toStrictEqual([]);
    });
});
