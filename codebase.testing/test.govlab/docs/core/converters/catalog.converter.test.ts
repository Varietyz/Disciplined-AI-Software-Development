import { afterAll, describe, expect, it } from "vitest";
import { catalogNodes, catalogPayload, concernGroups } from "@govlab/docs/core/converters/catalog.converter.ts";
import { join, relative } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { docNodeOf } from "@govlab/docs/core/converters/document.converter.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "doc-catalog-"));
mkdirSync(join(root, "docs"), { recursive: true });
writeVerbatim(join(root, "docs", "a.md"), "---\nname: a\ntype: guide\nconcern: scaling\n---\n# A\n");
writeVerbatim(join(root, "docs", "unnamed.md"), "# No frontmatter\n");
writeVerbatim(join(root, "outside.md"), "---\nname: outside\n---\n");

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

const NODES = [
    docNodeOf("docs/b.md", { concern: "scaling", name: "b", status: "current", type: "guide" }),
    docNodeOf("docs/c.md", { name: "c", status: "planned", type: "changelog" }),
];
const GRAPH = { byName: {}, cycles: [], deadEdges: [], duplicateNames: [], nodes: NODES, superseded: ["c"] };

describe("catalogNodes", () => {
    it("reads a node from each named document under the doc root", () => {
        const context = {
            docs: [join(root, "docs", "a.md"), join(root, "docs", "unnamed.md"), join(root, "outside.md")],
            relative: (doc: string) => relative(root, doc).split("\\").join("/"),
            root,
            rootPrefix: "docs/",
        };
        expect(catalogNodes(context).map((node) => node.name)).toStrictEqual(["a"]);
    });
});

describe("catalogPayload and concernGroups", () => {
    it("index the entries by concern, status and type, and group a concernless node under the module key", () => {
        const payload = catalogPayload(GRAPH, new Set(["c"]));
        expect(payload.docs.map((entry) => [entry.name, entry.superseded])).toStrictEqual([
            ["b", false],
            ["c", true],
        ]);
        expect(payload.byStatus).toStrictEqual({ current: ["b"], planned: ["c"] });
        expect([...concernGroups(GRAPH).keys()]).toStrictEqual(["scaling", "changelogs"]);
    });
});
