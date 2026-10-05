import { ADDRESS, GRAPH, PAGE } from "./site.fixture.ts";
import {
    buildRoutesOf,
    locationsOf,
    readArtifact,
    tabIdsOf,
} from "@banes-lab/build-scripts/core/converters/build.converter.ts";
import { describe, expect, it } from "vitest";

describe("readArtifact", () => {
    it("reads the title, description, robots, canonical, alternates, links and the main text out of a built page", () => {
        expect(readArtifact(PAGE)).toStrictEqual({
            alternates: { json: null, markdown: null },
            canonical: ADDRESS,
            description: "The terms.",
            links: [],
            robots: "index, follow",
            schema: GRAPH,
            text: "Real text",
            title: "Terms",
        });
    });
});

describe("locationsOf", () => {
    it("reads every location in document order and stops at an unclosed one", () => {
        expect(locationsOf(`<loc>${ADDRESS}</loc><loc>https://example.test/</loc><loc>open`)).toStrictEqual([
            ADDRESS,
            "https://example.test/",
        ]);
    });
});

describe("buildRoutesOf", () => {
    it("routes each page at its own path and each tab after the first at its tab link", () => {
        const payloads = new Map([
            ["terms", JSON.stringify({ content: { tabs: [{ id: "intro" }, { id: "guide" }] } })],
        ]);
        const routes = buildRoutesOf(["home", "terms"], (page) => payloads.get(page) ?? null);
        expect(routes.map((route) => [route.page, route.tab])).toStrictEqual([
            ["home", null],
            ["terms", null],
            ["terms", "guide"],
        ]);
        expect(routes[2]?.path).not.toBe(routes[1]?.path);
    });
});

describe("tabIdsOf", () => {
    it("reads the tab ids out of a tabbed payload and nothing out of any other", () => {
        const tabbed = JSON.stringify({ content: { kind: "tabbed", tabs: [{ id: "intro" }, { id: "guide" }] } });
        expect(tabIdsOf(tabbed)).toStrictEqual(["intro", "guide"]);
        expect(tabIdsOf(JSON.stringify({ content: { kind: "home" } }))).toStrictEqual([]);
    });
});
