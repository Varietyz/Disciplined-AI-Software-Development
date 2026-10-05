import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import type { Discovery } from "@banes-lab/build-scripts/types/site.types.ts";
import type { GraphNode } from "@banes-lab/web/types/graph.types.ts";
import { buildCatalog } from "@banes-lab/build-scripts/core/coordinators/catalog.coordinator.ts";
import { composeOntology } from "@banes-lab/build-scripts/core/coordinators/ontology.coordinator.ts";
import { createLinker } from "@banes-lab/build-scripts/core/resolvers/link.resolver.ts";
import { join } from "node:path";
import { loadWebModules } from "@banes-lab/build-scripts/core/loaders/catalog.loader.ts";
import { nodeLinks } from "@banes-lab/build-scripts/core/converters/link.converter.ts";
import { recordLeaf } from "@banes-lab/build-scripts/core/resolvers/catalog.resolver.ts";
import { tmpdir } from "node:os";
import { toolsOf } from "@banes-lab/build-scripts/core/converters/source.converter.ts";
import { writeCatalog } from "@banes-lab/build-scripts/core/persistence/catalog.persistence.ts";

const SITE = "https://example.test";

let root = "";

interface Recording {
    readonly importer: { readonly import: <T>(url: string) => Promise<T> };
    readonly seen: readonly string[];
}

const isModule = function isModule<T>(value: unknown): value is T {
    return typeof value === "object" && value !== null;
};

const fileId = function fileId(path: string): string {
    return `file-${path}`;
};

const recording = function recording(): Recording {
    const seen: string[] = [];
    return {
        importer: {
            import: async <T>(url: string): Promise<T> => {
                await Promise.resolve();
                seen.push(url);
                const module: unknown = Object.create(null);
                if (!isModule<T>(module)) {
                    throw new TypeError(url);
                }
                return module;
            },
        },
        seen,
    };
};

beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "catalog-write-"));
});

afterEach(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("writeCatalog", () => {
    it("writes every address to its file and counts what it wrote", () => {
        const files = new Map([
            ["/json/api", "{}\n"],
            ["/api.md", "# Site\n"],
            ["/json/source/tree/README.md", '{"path":"README.md"}\n'],
        ]);
        expect(writeCatalog(root, files)).toBe(3);
        expect(readFileSync(join(root, "json/api.json"), "utf8")).toBe("{}\n");
        expect(readFileSync(join(root, "api.md"), "utf8")).toBe("# Site\n");
        expect(readFileSync(join(root, "json/source/tree/README.md.json"), "utf8")).toBe('{"path":"README.md"}\n');
    });
});

describe("loadWebModules", () => {
    it("imports each web module the catalog reuses through the runner it is handed", async () => {
        const { importer, seen } = recording();
        const web = await loadWebModules(importer);
        expect(seen.every((url) => url.startsWith("@banes-lab/web/"))).toBe(true);
        expect(new Set(seen).size).toBe(seen.length);
        expect(Object.keys(web)).toHaveLength(seen.length);
    });
});

const chapterNode = function chapterNode(ref: string, href: string): GraphNode {
    return {
        address: null,
        citation: null,
        fields: {},
        href,
        kind: "chapter",
        layer: "site",
        number: null,
        ref,
        title: ref,
    };
};

describe("nodeLinks", () => {
    it("links a chapter edge through the identity at its node's href, and keeps an unknown chapter as a site link", () => {
        const identity = {
            address: recordLeaf("architecture", "a"),
            href: "/p#s",
            kind: "section",
            ref: "section:p-s",
            summary: null,
            title: "Section",
        };
        const linker = createLinker([identity], SITE, (href) => href);
        const nodes = new Map([
            ["chapter:/p#s", chapterNode("chapter:/p#s", "/p#s")],
            ["chapter:/missing", chapterNode("chapter:/missing", "/missing")],
        ]);
        const links = nodeLinks(linker, nodes, [
            { label: "Section", ref: "chapter:/p#s" },
            { label: "Gone", ref: "chapter:/missing" },
        ]);
        expect(links[0]?.ref).toBe("section:p-s");
        expect(links[1]).toStrictEqual({
            href: `${SITE}/missing`,
            json: null,
            label: "Gone",
            markdown: null,
            ref: "chapter:/missing",
        });
    });
});

describe("toolsOf", () => {
    it("gathers the source tools from the web modules that declare them", () => {
        const tools = toolsOf({
            anatomyConstants: { LINE_INFIX: "-L" },
            anatomyIds: { DEFINITION_ANCHOR: "definition-" },
            folder: { localPath: (path) => path },
            source: {
                fileId,
                folderHref: (path) => path,
                folderId: (path) => path,
                languageOf: () => "ts",
                nodeHref: (file) => file,
                nodeRoute: (path) => path,
                sourceTitle: (path) => path,
                treeLabelOf: (tab) => tab,
            },
        });
        expect(tools.lineInfix).toBe("-L");
        expect(tools.definitionAnchor).toBe("definition-");
        expect(tools.fileId).toBe(fileId);
    });
});

describe("buildCatalog", () => {
    it("refuses a page whose id would collide with a catalog segment before it imports anything", async () => {
        const { importer, seen } = recording();
        const page = {
            content: {},
            description: "",
            id: "records",
            label: "",
            markdown: "",
            page: "records",
            path: "/records",
            tab: null,
            title: "",
        };
        const discovery: Discovery = {
            author: "",
            consent: "",
            name: "",
            pages: [page],
            routes: [page],
            site: "",
            summary: "",
        };
        await expect(buildCatalog(importer, discovery, () => [], composeOntology())).rejects.toThrow('"records"');
        expect(seen).toStrictEqual([]);
    });
});
