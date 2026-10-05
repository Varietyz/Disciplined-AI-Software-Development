import { buildGroup, subtreeFiles } from "@govlab/patterns/core/converters/folder.converter.ts";
import { describe, expect, it } from "vitest";
import { entry } from "./package.fixture.ts";

const NODES = 3;

describe("the folder tree", () => {
    it("groups files under their folders and sums node counts upward", () => {
        const tree = buildGroup(
            [entry("index.ts", NODES), entry("core/a.ts", NODES), entry("core/b.ts", NODES)],
            "",
            "mod",
        );
        expect(tree.children.map((child) => [child.kind, child.name])).toStrictEqual([
            ["file", "index.ts"],
            ["dir", "core"],
        ]);
        expect(tree.count).toBe(NODES * NODES);
    });

    it("subtreeFiles lists every file below a node", () => {
        const tree = buildGroup([entry("core/a.ts", 1), entry("core/deep/b.ts", 1)], "", "mod");
        expect(subtreeFiles(tree).map((file) => file.rel)).toStrictEqual(["core/a.ts", "core/deep/b.ts"]);
    });
});
