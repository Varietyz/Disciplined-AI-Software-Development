import { BYTES, CALLEE, CALLEE_FILE, CODE_LINES, convert, report, tree } from "./anatomy.fixture.ts";
import {
    convertAnatomy,
    countFolders,
    referencedTrees,
    withRepository,
} from "@banes-lab/build-scripts/core/converters/anatomy.converter.ts";
import { describe, expect, it } from "vitest";
import type { DiskFolder } from "@banes-lab/build-scripts/types/structure.types.ts";
import type { ReferenceSite } from "@banes-lab/build-scripts/types/anatomy.types.ts";
import type { SourceReferences } from "@banes-lab/web/types/code.types.js";
import { UNQUALIFIED } from "@banes-lab/build-scripts/configuration/constants/anatomy.constants.ts";
import { createWalkAssets } from "@banes-lab/build-scripts/core/factories/walk.factory.ts";
import { definitionKey } from "@banes-lab/build-scripts/core/converters/report.converter.ts";

const README = "README.md";
const BACKUP = "backup";
const GENERATED_CODE = "ontology.generated.ts";

const reader = function reader(): SourceReferences {
    return { sites: [], spans: {}, strings: {}, targets: [], words: {} };
};

const generated = function generated(name: string): DiskFolder["files"][number] {
    return {
        bytes: BYTES,
        generated: true,
        inherited: false,
        lines: { blank: 0, code: 1, total: 1 },
        name,
        path: name,
        text: "# generated\n",
    };
};

describe("withRepository and countFolders", () => {
    it("gives every folder and file its repository path and counts the folders below the root", () => {
        const linked = withRepository(convert().tree, "https://code.x.test/tree/main", false);
        expect(linked.repository).toBe("https://code.x.test/tree/main");
        const file = linked.folders[0]?.folders[0]?.files[0];
        expect(file?.repository).toBe(`https://code.x.test/tree/main/${file?.path ?? ""}`);
        expect(countFolders(linked)).toBe(2);
    });

    it("links a generated file only for a tree that publishes its generated sources", () => {
        const snapshot = convertAnatomy(
            {
                cells: new Map(),
                charts: [],
                documents: new Map(),
                entries: [],
                generatedSources: true,
                imports: [],
                report: report(),
                tree: { ...tree(), files: [generated(GENERATED_CODE)] },
                vectors: new Map(),
            },
            createWalkAssets(),
        );
        const base = "https://code.x.test/tree/main";
        expect(withRepository(snapshot.tree, base, false).files[0]?.repository).toBeUndefined();
        expect(withRepository(snapshot.tree, base, true).files[0]?.repository).toBe(`${base}/${GENERATED_CODE}`);
    });
});

describe("referencedTrees", () => {
    it("leaves the trees alone without a reader and gives each file with a source its references otherwise", () => {
        const assets = createWalkAssets();
        const snapshot = convertAnatomy(
            {
                cells: new Map(),
                charts: [],
                documents: new Map(),
                entries: [],
                imports: [],
                report: report(),
                tree: tree(),
                vectors: new Map(),
            },
            assets,
        );
        const trees = [{ exportName: "ANATOMY", snapshot, tab: "tree" }];
        const sites = new Map<string, ReferenceSite>();
        expect(referencedTrees(trees, UNQUALIFIED, assets, sites)).toBe(trees);
        const [referenced] = referencedTrees(trees, { ...UNQUALIFIED, refer: () => reader }, assets, sites);
        const file = referenced?.snapshot.tree.folders[0]?.folders[0]?.files[0];
        expect(file?.references?.startsWith("references.")).toBe(true);
        expect(sites.has(file?.path ?? "")).toBe(true);
    });
});

describe("convertAnatomy", () => {
    it("folds file stats upward through every folder", () => {
        const snapshot = convert();
        const [container] = snapshot.tree.folders;
        const file = container?.folders[0]?.files[0];
        expect(file?.stats.definitions).toBe(1);
        expect(file?.stats.edges).toBe(1);
        expect(file?.stats.flows).toStrictEqual({ entry: 1 });
        expect(container?.stats.files).toBe(1);
        expect(container?.stats.lines.code).toBe(CODE_LINES);
        expect(snapshot.tree.stats.bytes).toBe(BYTES);
    });

    it("links a definition to its neighbors by id and gives a parsed file its walk and its source", () => {
        const file = convert().tree.folders[0]?.folders[0]?.files[0];
        expect(file?.definitions[0]?.callees[0]).toStrictEqual({
            file: CALLEE_FILE,
            id: definitionKey(CALLEE_FILE, CALLEE),
            name: CALLEE,
        });
        expect(file?.walk?.vector.endsWith(".generated.svg")).toBe(true);
        expect(file?.walk?.cells.endsWith(".generated.json")).toBe(true);
        expect(file?.walk?.steps).toBe(1);
        expect(file?.source?.startsWith("source.")).toBe(true);
    });

    it("ships a generated document's text but never a generated code file's", () => {
        const document = {
            boundary: true,
            concern: null,
            constructs: 0,
            fields: [],
            findings: [],
            form: null,
            headings: 1,
            mermaid: 0,
            paths: 0,
        };
        const snapshot = convertAnatomy(
            {
                cells: new Map(),
                charts: [],
                documents: new Map([[README, document]]),
                entries: [],
                imports: [],
                report: report(),
                tree: { ...tree(), files: [generated(README), generated(GENERATED_CODE)] },
                vectors: new Map(),
            },
            createWalkAssets(),
        );
        expect(snapshot.tree.files.find((file) => file.name === README)?.source?.startsWith("source.")).toBe(true);
        expect(snapshot.tree.files.find((file) => file.name === GENERATED_CODE)?.source).toBeNull();
    });

    it("gives an excluded file its reason and nothing the parser read", () => {
        const exclude = function exclude(folder: DiskFolder): DiskFolder {
            return {
                ...folder,
                files: folder.files.map((file) => ({ ...file, excluded: BACKUP })),
                folders: folder.folders.map(exclude),
            };
        };
        const snapshot = convertAnatomy(
            {
                cells: new Map(),
                charts: [],
                documents: new Map(),
                entries: [],
                imports: [],
                report: report(),
                tree: exclude(tree()),
                vectors: new Map(),
            },
            createWalkAssets(),
        );
        const file = snapshot.tree.folders[0]?.folders[0]?.files[0];
        expect(file?.excluded).toBe(BACKUP);
        expect(file?.definitions).toStrictEqual([]);
        expect(file?.findings).toStrictEqual([]);
        expect(file?.walk).toBeNull();
        expect(file?.source).toBeNull();
    });

    it("ships a generated code file's text for a tree that declares its generated sources", () => {
        const snapshot = convertAnatomy(
            {
                cells: new Map(),
                charts: [],
                documents: new Map(),
                entries: [],
                generatedSources: true,
                imports: [],
                report: report(),
                tree: { ...tree(), files: [generated(GENERATED_CODE)] },
                vectors: new Map(),
            },
            createWalkAssets(),
        );
        expect(snapshot.tree.files[0]?.source?.startsWith("source.")).toBe(true);
    });
});
