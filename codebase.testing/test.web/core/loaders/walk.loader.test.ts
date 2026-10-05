import {
    DEFINITION_ANCHOR,
    FILE_ANCHOR,
    FOLDER_ANCHOR,
    READING_TAB,
    TREE_TAB,
} from "@banes-lab/web/core/ids/anatomy.ids.ts";
import { SOURCE_ROOT, WALK_ROOT, sourceLocation, walkLocation } from "@banes-lab/web/core/assets/walk.assets.ts";
import { SOURCE_UNAVAILABLE, WALK_UNAVAILABLE } from "@banes-lab/web/configuration/strings/report.strings.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { citedDefinition, listDefinitions } from "@banes-lab/web/core/loaders/definition.loader.ts";
import { definitionBlock, definitionHref, sourceLink } from "@banes-lab/web/domain/converters/source.link.converter.ts";
import { definitionIndexOf, specifierResolverOf } from "@banes-lab/web/core/converters/definition.converter.ts";
import { fileId, folderHref, folderId, nodeHref } from "@banes-lab/web/domain/converters/source.converter.ts";
import {
    loadRecords,
    loadSource,
    loadWalk,
    sourceEntryOf,
    sourceNameOf,
} from "@banes-lab/web/core/loaders/walk.loader.ts";
import { ANATOMY } from "@banes-lab/web/core/generated/anatomy.generated.ts";
import { ANATOMY_FACE } from "@banes-lab/web/configuration/constants/vocabulary.constants.ts";
import { ANATOMY_INDEX } from "@banes-lab/web/core/generated/anatomy.index.generated.ts";
import { ANATOMY_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { ANATOMY_TREES } from "@banes-lab/web/core/registries/anatomy.registry.ts";
import { TYPESCRIPT_LANGUAGE } from "@banes-lab/web/configuration/constants/code.constants.ts";
import { citedSource } from "@banes-lab/web/domain/loaders/anatomy.loader.ts";
import { tabLink } from "@banes-lab/web/core/assets/link.assets.ts";
import { targetOf } from "@banes-lab/web/core/converters/folder.converter.ts";
import { targetOfHref } from "@banes-lab/web/domain/converters/reference.converter.ts";

const VECTOR = "walk.a.generated.svg";
const CELLS = "walk.a.generated.json";
const MARKUP = "<svg></svg>";
const VECTOR_TYPE = "image/svg+xml";
const FACTORY = ["core", "factories", "element.factory.ts"].join("/");
const FACTORY_NAME = "element.factory.ts";
const CREATE = "createElement";
const ABSENT = "noSuchDefinitionAnywhere";
const CITED_TITLE = "the factory";
const RENDERER = ["presentation", "renderers", "tab.renderer.ts"].join("/");
const PAYLOAD = {
    columns: ["state", "depth", "label", "file", "line", "name", "text", "severity"],
    rows: [["call", 1, "identifier", "core/a.ts", 3, "go", "go()", null]],
};

const firstFile = function firstFile(): { readonly path: string; readonly source: string | null } {
    const file = ANATOMY.tree.folders
        .flatMap((folder) => folder.folders.flatMap((child) => child.files))
        .find((candidate) => candidate.source !== null);
    if (file === undefined) {
        throw new Error(VECTOR);
    }
    return file;
};

const factoryLine = function factoryLine(): number {
    const cited = citedDefinition(CREATE);
    if (cited?.file !== FACTORY) {
        throw new Error(CREATE);
    }
    return cited.line;
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("loadWalk and loadSource", () => {
    it("fetches the vector and its cells once, unpacks the cells by column, and answers null when either is missing", async () => {
        const fetched = vi.fn(async (url: string) => {
            if (url === walkLocation(VECTOR)) {
                return new Response(MARKUP, { headers: { "content-type": VECTOR_TYPE }, status: 200 });
            }
            if (url === walkLocation(CELLS)) {
                return Response.json(PAYLOAD, { status: 200 });
            }
            return new Response("", { status: 404 });
        });
        vi.stubGlobal("fetch", fetched);
        const walk = await loadWalk({ cells: CELLS, steps: 1, vector: VECTOR });
        expect(walk?.markup).toBe(MARKUP);
        expect(walk?.cells[0]).toStrictEqual({
            depth: 1,
            file: "core/a.ts",
            label: "identifier",
            line: 3,
            name: "go",
            ref: "0",
            severity: null,
            state: "call",
            text: "go()",
        });
        await loadWalk({ cells: CELLS, steps: 1, vector: VECTOR });
        expect(fetched).toHaveBeenCalledTimes(2);
        const logged = vi.spyOn(console, "error").mockReturnValue();
        const missing = { cells: "missing.json", steps: 1, vector: "missing.svg" };
        expect(await loadWalk(missing)).toBeNull();
        expect(logged).toHaveBeenCalledWith(WALK_UNAVAILABLE, missing);
        vi.stubGlobal(
            "fetch",
            async (url: string) =>
                new Response(url === sourceLocation("s.txt") ? "text" : "", {
                    status: url === sourceLocation("s.txt") ? 200 : 404,
                }),
        );
        expect(await loadSource("s.txt")).toBe("text");
        expect(await loadSource("gone.txt")).toBeNull();
        expect(logged).toHaveBeenCalledWith(SOURCE_UNAVAILABLE, "gone.txt");
        logged.mockRestore();
        expect(walkLocation(VECTOR)).toBe(WALK_ROOT + VECTOR);
        expect(sourceLocation("s.txt")).toBe(`${SOURCE_ROOT}s.txt`);
    });
});

describe("targetOfHref", () => {
    it("resolves a tree link to the anatomy collection and a reading link to a chapter", () => {
        const id = fileId(FACTORY);
        expect(targetOfHref(tabLink(ANATOMY_PAGE, TREE_TAB, id))).toStrictEqual({
            face: ANATOMY_FACE,
            ref: `${ANATOMY_FACE}:${id}`,
        });
        expect(targetOfHref(tabLink(ANATOMY_PAGE, READING_TAB, "this-page-is-derived"))?.face).toBe("chapter");
    });
});

describe("loadRecords", () => {
    it("answers null for a node with no records asset, and for an asset whose payload is not records", async () => {
        expect(await loadRecords(ANATOMY_INDEX.nodes[`${FILE_ANCHOR}nowhere`])).toBeNull();
        vi.stubGlobal("fetch", async () => Response.json({ node: "not a record" }));
        const logged = vi.spyOn(console, "error").mockReturnValue();
        expect(await loadRecords("records.malformed.generated.json")).toBeNull();
        expect(logged).toHaveBeenCalledWith(SOURCE_UNAVAILABLE, "records.malformed.generated.json");
        logged.mockRestore();
    });
});

describe("citations by definition name", () => {
    it("links a construct to its file and line, keeps an unresolved name as a definition anchor, and cites its source with the line", () => {
        const line = factoryLine();
        expect(definitionHref(CREATE)).toBe(nodeHref(FACTORY, line));
        expect(nodeHref(FACTORY, line)).toBe(tabLink(ANATOMY_PAGE, TREE_TAB, `${fileId(FACTORY)}:${String(line)}`));
        expect(definitionHref(ABSENT)).toBe(tabLink(ANATOMY_PAGE, TREE_TAB, DEFINITION_ANCHOR + ABSENT));
        expect(folderHref("")).toBe(tabLink(ANATOMY_PAGE, TREE_TAB, folderId("")));
        expect(folderId("")).toBe(`${FOLDER_ANCHOR}root`);
        expect(sourceLink(CREATE, CITED_TITLE)).toBe(`<a href="${definitionHref(CREATE)}">${CITED_TITLE}</a>`);
        expect(targetOf(`#${DEFINITION_ANCHOR}${CREATE}:${FACTORY_NAME}`)).toStrictEqual({
            id: DEFINITION_ANCHOR + CREATE,
            line: null,
            text: FACTORY_NAME,
        });
        expect(citedDefinition(CREATE, "nowhere.ts")).toBeNull();
        const block = definitionBlock(CREATE, CITED_TITLE);
        expect(block).toStrictEqual({ file: FACTORY, kind: "definition", line, name: CREATE, title: CITED_TITLE });
        const cited = citedSource(block);
        expect(cited?.location).toStrictEqual({ file: FACTORY, line, name: CREATE });
        expect(cited?.block.kind).toBe("source");
        expect(cited?.block.language).toBe(TYPESCRIPT_LANGUAGE);
        expect(cited?.block.path).toBe(FACTORY);
        expect(cited?.block.source).toBe(sourceNameOf(FACTORY));
        expect(cited?.block.title).toBe(CITED_TITLE);
        expect(citedSource({ ...block, file: "nowhere.ts" })).toBeNull();
        expect(citedSource({ ...block, line: null })).toBeNull();
    });
});

describe("specifierResolverOf", () => {
    it("resolves an aliased or relative specifier to a file in the set, and nothing outside it", () => {
        const resolve = specifierResolverOf(new Set([FACTORY, RENDERER, "build~core/a.ts"]));
        expect(resolve(`#${["factories", "element.factory"].join("/")}`, RENDERER)).toBe(FACTORY);
        expect(resolve("./tab.renderer", ["presentation", "renderers", "chapter.renderer.ts"].join("/"))).toBe(
            RENDERER,
        );
        expect(resolve("#a", "build~core/b.ts")).toBe("build~core/a.ts");
        expect(resolve("#a", RENDERER)).toBeNull();
        expect(resolve("vitest", RENDERER)).toBeNull();
    });
});

describe("sourceNameOf and the definition index", () => {
    it("finds a file's source asset by path, definitions by name, and files by import specifier", () => {
        const index = definitionIndexOf(ANATOMY_TREES.map((tree) => tree.snapshot.tree));
        const file = firstFile();
        expect(sourceNameOf(file.path)).toBe(file.source);
        expect(sourceEntryOf(file.path)?.source).toBe(file.source);
        expect(sourceEntryOf("nowhere.ts")).toBeNull();
        expect(sourceNameOf("nowhere.ts")).toBeNull();
        const named = index.definitionsNamed(CREATE);
        expect(named.some((location) => location.file === FACTORY)).toBe(true);
        expect(index.definitionsNamed(ABSENT)).toStrictEqual([]);
        expect(listDefinitions()).toStrictEqual(index.listDefinitions());
        expect(
            index.listDefinitions().every((location) => index.definitionsNamed(location.name).includes(location)),
        ).toBe(true);
        expect(index.resolveSpecifier(`#${["core", "factories", "element.factory"].join("/")}`, RENDERER)).toBe(
            FACTORY,
        );
        expect(index.resolveSpecifier(`#${["core", "assets", "link.assets"].join("/")}`, RENDERER)).toBe(
            ["core", "assets", "link.assets.ts"].join("/"),
        );
        expect(
            index.resolveSpecifier("./tab.renderer", ["presentation", "renderers", "chapter.renderer.ts"].join("/")),
        ).toBe(RENDERER);
        expect(
            index.resolveSpecifier(
                ["..", "renderers", "tab.renderer"].join("/"),
                ["presentation", "widgets", "tab.widget.ts"].join("/"),
            ),
        ).toBe(RENDERER);
        expect(index.resolveSpecifier("@govlab/constants", RENDERER)?.endsWith("index.ts")).toBe(true);
        expect(index.resolveSpecifier("vitest", RENDERER)).toBeNull();
        expect(index.resolveSpecifier(`#${["core", "missing"].join("/")}`, RENDERER)).toBeNull();
    });
});
