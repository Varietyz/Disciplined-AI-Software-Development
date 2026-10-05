import { CONCERN_FOLDER, CONCERN_PATH, CONTAINER, convert } from "./anatomy.fixture.ts";
import { describe, expect, it } from "vitest";
import {
    fileWalkOf,
    folderWalkOf,
    pageIdOf,
    qualifyWalks,
    recordsAssetOf,
    referencesAssetOf,
    sourceOf,
} from "@banes-lab/build-scripts/core/converters/walk.converter.ts";
import { createWalkAssets } from "@banes-lab/build-scripts/core/factories/walk.factory.ts";

describe("pageIdOf", () => {
    it("joins a folder path into one page id", () => {
        expect(pageIdOf(CONCERN_PATH)).toBe(`${CONTAINER}__${CONCERN_FOLDER}`);
    });
});

describe("qualifyWalks", () => {
    it("rewrites every file path the folder's walks name and leaves a cell without a file alone", () => {
        const assets = createWalkAssets();
        const base = { depth: 0, label: "program", line: 1, name: "", ref: "r", severity: null, state: "", text: "" };
        const cells = [
            { ...base, file: "a.ts" },
            { ...base, file: "" },
        ];
        const walk = folderWalkOf(assets, "", new Map([["code", "<svg/>"]]), new Map([["code", cells]]));
        const folder = { ...convert().tree, walk };
        qualifyWalks(folder, (path) => `build~${path}`, assets);
        const held = walk === null ? undefined : assets.cells.get(walk.cells);
        expect(held?.map((cell) => cell.file)).toStrictEqual(["build~a.ts", ""]);
        expect(assets.walks.get(walk?.cells ?? "")).toContain("build~a.ts");
    });
});

describe("referencesAssetOf", () => {
    it("stores the references as a digest-named source asset", () => {
        const assets = createWalkAssets();
        const references = { sites: [], spans: {}, strings: {}, targets: [], words: {} };
        const name = referencesAssetOf(assets, references);
        expect(name.startsWith("references.")).toBe(true);
        expect(assets.sources.get(name)).toBe(JSON.stringify(references));
    });
});

describe("recordsAssetOf", () => {
    it("stores the records as a digest-named source asset, one name for equal records", () => {
        const assets = createWalkAssets();
        const records = {
            definitions: {},
            node: { code: null, kind: "file", layer: null, name: "a.ts", relations: [], summary: null },
        };
        const name = recordsAssetOf(assets, records);
        expect(name.startsWith("records.")).toBe(true);
        expect(assets.sources.get(name)).toBe(JSON.stringify(records));
        expect(recordsAssetOf(assets, { ...records })).toBe(name);
        expect(recordsAssetOf(assets, { ...records, definitions: { "1": records.node } })).not.toBe(name);
    });
});

describe("fileWalkOf, folderWalkOf and sourceOf", () => {
    it("gives no walk where nothing was parsed and names a source asset by its text", () => {
        const assets = createWalkAssets();
        expect(fileWalkOf(assets, undefined, new Map())).toBeNull();
        expect(folderWalkOf(assets, "", new Map(), new Map())).toBeNull();
        expect(sourceOf(assets, "text").startsWith("source.")).toBe(true);
    });
});
