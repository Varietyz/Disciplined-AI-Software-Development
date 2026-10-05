import { CONCERN_PATH, CONTAINER, FILE_NAME, FILE_PATH, convert } from "./anatomy.fixture.ts";
import { describe, expect, it } from "vitest";
import type { SourceRouteTools } from "@banes-lab/build-scripts/types/source.types.ts";
import { sourceRoutes } from "@banes-lab/build-scripts/core/converters/source.route.converter.ts";

const TOOLS: SourceRouteTools = {
    languageOf: () => "typescript",
    license: () => "CC-BY-SA-4.0",
    localPath: (path) => path,
    nodeRoute: (path, folder) => `/anatomy/tree/${folder ? "folder" : "file"}-${path.length === 0 ? "root" : path}`,
    sourceTitle: (path) => `Site · ${path}`,
    tabPath: (tab) => `/anatomy/${tab}`,
};

describe("sourceRoutes", () => {
    const routes = sourceRoutes([{ label: "Site", snapshot: convert(), tab: "tree" }], TOOLS);
    const paths = routes.map((route) => route.subject.path);

    it("gives every folder and every file one route, the root folder first", () => {
        expect(paths).toStrictEqual([
            "/anatomy/tree/folder-root",
            `/anatomy/tree/folder-${CONTAINER}`,
            `/anatomy/tree/folder-${CONCERN_PATH}`,
            `/anatomy/tree/file-${FILE_PATH}`,
        ]);
    });

    it("points a file at its catalog leaf, its parent folder and its source text", () => {
        const file = routes.at(-1);
        expect(file?.subject.alternates.json).toBe(`/json/source/tree/${FILE_PATH}`);
        expect(file?.subject.alternates.markdown).toBe(`/source/tree/${FILE_PATH}.md`);
        expect(file?.subject.language).toBe("typescript");
        expect(file?.subject.license).toBe("CC-BY-SA-4.0");
        expect(file?.parent.path).toBe(`/anatomy/tree/folder-${CONCERN_PATH}`);
        expect(file?.text?.startsWith("source.")).toBe(true);
        expect(file?.subject.description).toContain(FILE_PATH);
    });

    it("lists a folder's children and points the root at the tree index", () => {
        const [root] = routes;
        expect(root?.subject.alternates.json).toBe("/json/api/source/tree");
        expect(root?.subject.name).toBe("Site");
        expect(root?.subject.language).toBeNull();
        expect(root?.parent.path).toBe("/anatomy/tree");
        expect(routes[2]?.children).toStrictEqual([{ label: FILE_NAME, path: `/anatomy/tree/file-${FILE_PATH}` }]);
    });
});
