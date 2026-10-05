import {
    buildOutput,
    pageIds,
    readOrNull,
    sourcePagePaths,
} from "@banes-lab/build-scripts/core/loaders/build.loader.ts";
import { describe, expect, it } from "vitest";
import { absolutePath } from "@ssot/paths";

describe("buildOutput and readOrNull", () => {
    it("reads under the site build folder and answers null for a file the build did not write", () => {
        expect(buildOutput()).toBe(absolutePath("builds.web"));
        expect(readOrNull("no/such/file.txt")).toBeNull();
    });
});

describe("sourcePagePaths", () => {
    it("lists the pages below a page's tab folders as routes, and nothing for a folder the build did not write", () => {
        expect(sourcePagePaths("no-such-page")).toStrictEqual([]);
        const paths = sourcePagePaths("anatomy");
        expect(paths.every((path) => path.startsWith("/anatomy/") && path.split("/").length === 4)).toBe(true);
    });
});

describe("pageIds", () => {
    it("lists every page id the web member declares", async () => {
        const ids = await pageIds();
        expect(ids.length).toBeGreaterThan(0);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
