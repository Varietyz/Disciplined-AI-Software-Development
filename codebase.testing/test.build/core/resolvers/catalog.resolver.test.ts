import {
    closureLeaf,
    closureReport,
    collectionIndex,
    contactIndex,
    facetCollectionIndex,
    facetFieldIndex,
    facetLeaf,
    facetsIndex,
    fileOfAddress,
    folderIndex,
    graphReport,
    idsIndex,
    idsShard,
    indexPart,
    joined,
    localAddress,
    movedIndex,
    numbersIndex,
    pageIndex,
    pagesIndex,
    queryIndex,
    recordLeaf,
    recordsIndex,
    resolveLeaf,
    resolveMap,
    routeIndex,
    schemaLeaf,
    searchIndex,
    searchKindIndex,
    searchShard,
    sectionLeaf,
    siteIndex,
    slugShard,
    sourceLeaf,
    sourceText,
    retabbedAddress,
    sourcesIndex,
    treeAddressRoots,
    treeIndex,
} from "@banes-lab/build-scripts/core/resolvers/catalog.resolver.ts";
import { describe, expect, it } from "vitest";
import { RESERVED_SEGMENTS } from "@banes-lab/build-scripts/configuration/constants/catalog.constants.ts";

describe("treeAddressRoots and retabbedAddress", () => {
    it("names a tree's folder index and leaf roots, and moves an address of one tab to another", () => {
        expect(treeAddressRoots("build")).toStrictEqual(["/json/api/source/build", "/json/source/build"]);
        expect(retabbedAddress("/json/source/build/a/b.ts", "build", "content")).toBe("/json/source/content/a/b.ts");
        expect(retabbedAddress("/json/api/source/build", "build", "content")).toBe("/json/api/source/content");
        expect(retabbedAddress("/json/source/builder/a.ts", "build", "content")).toBeNull();
        expect(retabbedAddress("/json/records/x", "build", "content")).toBeNull();
    });
});

describe("catalog addresses", () => {
    it("serves every level as JSON under the json route and, where it has one, as Markdown", () => {
        expect(siteIndex()).toStrictEqual({ json: "/json/api", markdown: "/api.md" });
        expect(pageIndex("pag")).toStrictEqual({ json: "/json/api/pages/pag", markdown: "/api/pages/pag.md" });
        expect(pageIndex("pag", "guide").json).toBe("/json/api/pages/pag/guide");
        expect(sectionLeaf("pag", "guide", "node-design")).toStrictEqual({
            json: "/json/pag/guide/node-design",
            markdown: "/pag/guide/node-design.md",
        });
        expect(sectionLeaf("faq", null, "origin").json).toBe("/json/faq/origin");
        expect(collectionIndex("architecture").markdown).toBe("/api/records/architecture.md");
        expect(recordLeaf("architecture", "single-responsibility").json).toBe(
            "/json/records/architecture/single-responsibility",
        );
        expect(closureLeaf("algorithms", "x")).toStrictEqual({
            json: "/json/records/algorithms/x/closure",
            markdown: "/records/algorithms/x/closure.md",
        });
        expect(facetLeaf("architecture", "severity", "mandatory").json).toBe(
            "/json/api/facets/architecture/severity/mandatory",
        );
        expect(resolveLeaf("srp")).toStrictEqual({ json: "/json/api/resolve/srp", markdown: "/api/resolve/srp.md" });
        expect(resolveMap().json).toBe("/json/api/resolve");
        expect(treeIndex("build").json).toBe("/json/api/source/build");
        expect(sourceLeaf("build", "core/x.ts")).toStrictEqual({
            json: "/json/source/build/core/x.ts",
            markdown: "/source/build/core/x.ts.md",
        });
        expect(routeIndex().markdown).toBe("/api/route.md");
        expect(numbersIndex().json).toContain("/json/api/");
        expect(idsIndex().markdown).toBe("/api/ids.md");
        expect(searchIndex().json).toBe("/json/api/search");
        expect(contactIndex().markdown).toBe("/api/contact.md");
        expect(schemaLeaf("record")).toStrictEqual({
            json: "/json/api/schema/record",
            markdown: "/api/schema/record.md",
        });
        expect(movedIndex()).toStrictEqual({ json: "/json/api/moved", markdown: "/api/moved.md" });
        expect(queryIndex()).toStrictEqual({ json: "/json/api/query", markdown: "/api/query.md" });
    });

    it("places each shard of a large index beneath the index it splits", () => {
        expect(idsShard("architecture")).toStrictEqual({
            json: "/json/api/ids/architecture",
            markdown: "/api/ids/architecture.md",
        });
        expect(
            indexPart({ json: "/json/api/records/lexicon", markdown: "/api/records/lexicon.md" }, "2"),
        ).toStrictEqual({ json: "/json/api/records/lexicon/_2", markdown: "/api/records/lexicon/_2.md" });
        expect(indexPart(idsIndex(), "3")).toStrictEqual({ json: "/json/api/ids/_3", markdown: "/api/ids/_3.md" });
        expect(indexPart({ json: "/json/api/x", markdown: null }, "3")).toStrictEqual({
            json: "/json/api/x/_3",
            markdown: null,
        });
        expect(searchKindIndex("records")).toStrictEqual({
            json: "/json/api/search/records",
            markdown: "/api/search/records.md",
        });
        expect(searchShard("records", "g")).toStrictEqual({
            json: "/json/api/search/records/g",
            markdown: "/api/search/records/g.md",
        });
        expect(slugShard("s")).toStrictEqual({ json: "/json/api/slugs/s", markdown: "/api/slugs/s.md" });
    });

    it("refuses a segment that would escape its folder or carry an unsafe character, and admits a placeholder", () => {
        expect(() => joined(["records", ".."])).toThrow("..");
        expect(() => joined(["records", "a b"])).toThrow("a b");
        expect(() => joined(["records", ""])).toThrow();
        expect(joined(["records", "{collection}"])).toBe("/records/{collection}");
    });

    it("drops the unsafe characters of a source path segment and keeps a placeholder whole", () => {
        expect(sourceLeaf("tree", ".{name}/a b.md").json).toBe("/json/source/tree/.name/ab.md");
        expect(sourceLeaf("{tree}", "{path}").json).toBe("/json/source/{tree}/{path}");
        expect(() => sourceLeaf("tree", "{}/x.md")).toThrow();
    });

    it("reserves only the segments the catalog owns at the top of the site", () => {
        expect([...RESERVED_SEGMENTS].sort()).toStrictEqual(["api", "records", "source"]);
    });
});

describe("index levels", () => {
    it("places the level indexes, the facet levels and the folder indexes under the api segment", () => {
        expect(pagesIndex()).toStrictEqual({ json: "/json/api/pages", markdown: "/api/pages.md" });
        expect(recordsIndex().json).toBe("/json/api/records");
        expect(sourcesIndex().json).toBe("/json/api/source");
        expect(facetsIndex().markdown).toBe("/api/facets.md");
        expect(facetCollectionIndex("architecture").json).toBe("/json/api/facets/architecture");
        expect(facetFieldIndex("architecture", "severity").json).toBe("/json/api/facets/architecture/severity");
        expect(folderIndex("build", "alpha/beta")).toStrictEqual({
            json: "/json/api/source/build/alpha/beta",
            markdown: "/api/source/build/alpha/beta.md",
        });
    });
});

describe("sourceText", () => {
    it("places a file's plain text beside its leaf under the same safe path, with the text extension", () => {
        expect(sourceText("build", "core/x.ts")).toBe("/source/build/core/x.ts.txt");
        expect(sourceText("tree", "a b/c.ts")).toBe("/source/tree/ab/c.ts.txt");
        expect(fileOfAddress(sourceText("build", "core/x.ts"))).toBe("source/build/core/x.ts.txt");
    });
});

describe("localAddress and the reports", () => {
    it("strips the site from an absolute address and leaves a local one alone", () => {
        expect(localAddress("https://x.test", "https://x.test/json/api")).toBe("/json/api");
        expect(localAddress("https://x.test", "/json/api")).toBe("/json/api");
    });

    it("places the closure and graph reports as generated JSON under the reports folder", () => {
        expect(closureReport().endsWith(".generated.json")).toBe(true);
        expect(graphReport().endsWith(".generated.json")).toBe(true);
        expect(closureReport()).not.toBe(graphReport());
    });
});

describe("fileOfAddress", () => {
    it("maps a JSON address to its .json file even when the address itself ends in .md", () => {
        expect(fileOfAddress("/json/api")).toBe("json/api.json");
        expect(fileOfAddress("/json/source/tree/README.md")).toBe("json/source/tree/README.md.json");
        expect(fileOfAddress("/source/tree/README.md.md")).toBe("source/tree/README.md.md");
    });
});
