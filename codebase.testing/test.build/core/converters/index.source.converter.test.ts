import type { AnatomyFile, AnatomySnapshot } from "@banes-lab/web/types/anatomy.types.js";
import { EMPTY_SNAPSHOT, FILE, SITE, entry, fileIdentity } from "./index.fixture.ts";
import { describe, expect, it } from "vitest";
import { indexLeaves } from "@banes-lab/build-scripts/core/converters/index.converter.ts";
import { sourceIndexPlans } from "@banes-lab/build-scripts/core/converters/index.source.converter.ts";

const FILE_REF = "anatomy:file-a.ts";

describe("sourceIndexPlans", () => {
    it("indexes each source tree's files under the tree's label", () => {
        const tree = { label: "Build", snapshot: EMPTY_SNAPSHOT, tab: "build" };
        const files = [{ file: FILE, identity: fileIdentity("a.ts"), tree }];
        const [index] = indexLeaves(
            sourceIndexPlans(files, (path) => path).trees,
            new Map([[FILE_REF, entry(FILE_REF, "a.ts")]]),
            SITE,
        );
        expect(index?.identity).toMatchObject({ ref: "api:source/build", title: "Build" });
        expect(index?.identity.address.json).toBe("/json/api/source/build");
        expect(index?.data).toMatchObject({ entries: [{ ref: FILE_REF }], tree: "build" });
    });

    it("indexes each folder with its child folders and files, and the tree with its top level", () => {
        const nested: AnatomyFile = { ...FILE, id: "core/b.ts", name: "b.ts", path: "core/b.ts" };
        const snapshot: AnatomySnapshot = {
            ...EMPTY_SNAPSHOT,
            tree: {
                ...EMPTY_SNAPSHOT.tree,
                folders: [{ ...EMPTY_SNAPSHOT.tree, files: [nested], id: "core", name: "core", path: "core" }],
            },
        };
        const tree = { label: "Build", snapshot, tab: "build" };
        const files = [
            { file: FILE, identity: fileIdentity("a.ts"), tree },
            { file: nested, identity: fileIdentity("core/b.ts"), tree },
        ];
        const { folders, trees } = sourceIndexPlans(files, (path) => path);
        expect(trees[0]?.refs).toStrictEqual(["api:source/build/core", FILE_REF]);
        expect(folders.map((plan) => [plan.identity.ref, plan.identity.address.json, plan.refs])).toStrictEqual([
            ["api:source/build/core", "/json/api/source/build/core", ["anatomy:file-core/b.ts"]],
        ]);
    });

    it("publishes no index for a folder that holds no published file, and its parent does not list it", () => {
        const inner = { ...EMPTY_SNAPSHOT.tree, files: [], id: "outer.inner", name: "inner", path: "outer.inner" };
        const outer = {
            ...EMPTY_SNAPSHOT.tree,
            files: [],
            folders: [inner],
            id: "outer",
            name: "outer",
            path: "outer",
        };
        const snapshot: AnatomySnapshot = { ...EMPTY_SNAPSHOT, tree: { ...EMPTY_SNAPSHOT.tree, folders: [outer] } };
        const tree = { label: "Build", snapshot, tab: "build" };
        const { folders, trees } = sourceIndexPlans(
            [{ file: FILE, identity: fileIdentity("a.ts"), tree }],
            (path) => path,
        );
        expect(folders).toStrictEqual([]);
        expect(trees[0]?.refs).toStrictEqual([FILE_REF]);
    });
});
