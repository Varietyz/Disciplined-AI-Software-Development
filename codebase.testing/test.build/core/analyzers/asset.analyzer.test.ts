import { UNREFERENCED, builtOutput } from "../persistence/asset.fixture.ts";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { referencesIn, unreferencedFiles } from "@banes-lab/build-scripts/core/analyzers/asset.analyzer.ts";
import { rmSync } from "node:fs";

let outDir = "";

beforeEach(() => {
    outDir = builtOutput();
});

afterEach(() => {
    rmSync(outDir, { force: true, recursive: true });
});

const byName = function byName(...paths: string[]): Map<string, string[]> {
    return new Map(paths.map((path) => [path.slice(path.lastIndexOf("/") + 1), [path]]));
};

describe("unreferencedFiles", () => {
    it("keeps the served routes and everything they reach transitively, by root or sibling reference, and names the rest", () => {
        expect(unreferencedFiles(outDir)).toStrictEqual(UNREFERENCED);
    });
});

describe("referencesIn", () => {
    it("reads an absolute URL with a query, a parent path and a sibling path", () => {
        const text = '"https://site.test/assets/a.js?v=1" "../json/b.json#x" "./c.js" "/assets/other.js"';
        const found = referencesIn(text, "assets/app.js", byName("assets/a.js", "json/b.json", "assets/c.js"));
        expect([...found].sort()).toStrictEqual(["assets/a.js", "assets/c.js", "json/b.json"]);
    });

    it("reads a name a script joins to a root at runtime, as a tail of the candidate's path", () => {
        const text = "q(`site.badge.asset.gif`);q(`assets/grammar.emblem.asset.png`)";
        const found = referencesIn(
            text,
            "assets/chunk.js",
            byName("assets/assets/site.badge.asset.gif", "assets/assets/grammar.emblem.asset.png"),
        );
        expect(found.size).toBe(2);
    });

    it("reads a reference inside an escaped quote, as JSON and scripts carry markup", () => {
        const found = referencesIn(
            String.raw`{"html":"<img src=\"/assets/x.png\">"}`,
            "json/a.json",
            byName("assets/x.png"),
        );
        expect(found.has("assets/x.png")).toBe(true);
    });

    it("keeps a candidate apart from a file that only shares its name in another folder", () => {
        const found = referencesIn('"/other/a.js"', "index.html", byName("assets/a.js"));
        expect(found.size).toBe(0);
    });
});
