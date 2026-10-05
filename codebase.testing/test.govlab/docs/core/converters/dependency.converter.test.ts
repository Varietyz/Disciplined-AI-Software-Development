import { describe, expect, it } from "vitest";
import {
    moduleDepsOf,
    scopedDepNames,
    workspaceMapDoc,
    workspaceRows,
} from "@govlab/docs/core/converters/dependency.converter.ts";
import type { ManifestModule } from "@govlab/docs/types/manifest.types.ts";
import { renderRenderable } from "@govlab/docs/core/formatters/markdown.formatter.ts";

const moduleOf = function moduleOf(slug: string, pkg: Record<string, unknown>, maturity?: string): ManifestModule {
    return {
        dir: slug,
        group: "utils",
        label: slug,
        manifest: maturity === undefined ? {} : { maturity },
        pkg,
        relPath: slug,
        slug,
    };
};

const MODULES = [
    moduleOf("b", { dependencies: { "@govlab/a": "*", zod: "1" }, name: "@govlab/b" }, "stable"),
    moduleOf("a", {}),
];

describe("scopedDepNames", () => {
    it("keeps only the sibling-scope dependencies", () => {
        expect(scopedDepNames({ "@govlab/a": "*", zod: "1" })).toStrictEqual(["@govlab/a"]);
        expect(scopedDepNames(null)).toStrictEqual([]);
    });
});

describe("workspaceRows and moduleDepsOf", () => {
    it("build one sorted row per module, falling back to the slug and a missing maturity", () => {
        const rows = workspaceRows(MODULES);
        expect(rows.map((row) => row.name)).toStrictEqual(["@govlab/b", "a"]);
        expect(rows[0]?.maturity).toBe("stable");
        expect(moduleDepsOf(rows)).toStrictEqual([
            { deps: ["@govlab/a"], name: "@govlab/b" },
            { deps: [], name: "a" },
        ]);
    });
});

describe("workspaceMapDoc", () => {
    it("composes a graph section and an inventory table", () => {
        const doc = workspaceMapDoc(MODULES);
        expect(doc.body.map((section) => section.heading)).toStrictEqual([
            "Sibling-dependency graph",
            "Module inventory",
        ]);
        expect(renderRenderable(doc.body[1]?.content)).toContain("| `@govlab/b` | utils | stable | 1 |");
    });
});
