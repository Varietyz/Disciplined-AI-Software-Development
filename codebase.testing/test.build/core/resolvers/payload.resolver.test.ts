import { describe, expect, it } from "vitest";
import { markdownRouteOf, pageIdOf, pathOf } from "@banes-lab/build-scripts/core/resolvers/payload.resolver.ts";
import { JSON_ROUTE } from "@banes-lab/build-scripts/configuration/constants/site.constants.ts";

describe("pathOf", () => {
    it("drops the query from a request address", () => {
        expect(pathOf("/json/pag?x=1&y=2")).toBe("/json/pag");
        expect(pathOf("/pag")).toBe("/pag");
    });
});

describe("pageIdOf", () => {
    it("reads the page and tab under the json route, ignoring a query and a json suffix", () => {
        expect(pageIdOf(`${JSON_ROUTE}pag?x=1`)).toStrictEqual({ page: "pag", tab: null });
        expect(pageIdOf(`${JSON_ROUTE}pag/guide.json`)).toStrictEqual({ page: "pag", tab: "guide" });
        expect(pageIdOf("/pag")).toBeNull();
    });
});

describe("markdownRouteOf", () => {
    it("maps a markdown alternate back to its route, the index alternate to the home path, and nothing else", () => {
        expect(markdownRouteOf("/pag/guide.md")).toBe("/pag/guide");
        expect(markdownRouteOf("/index.md?x=1")).toBe("/");
        expect(markdownRouteOf("/pag")).toBeNull();
    });
});
