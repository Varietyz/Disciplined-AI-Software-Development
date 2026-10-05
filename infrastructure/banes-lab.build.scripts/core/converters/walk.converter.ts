import type { AnatomyFolder, WalkRef } from "@banes-lab/web/types/anatomy.types.js";
import { type FileEntry, type WalkCell, packCells, renderHexGrid, walkCells } from "@govlab/patterns";
import type { AnatomyRecords } from "@banes-lab/web/types/record.types.js";
import type { SourceReferences } from "@banes-lab/web/types/code.types.js";
import type { WalkAssets } from "#types/anatomy.types";
import { digestedFileName } from "#core/resolvers/asset.resolver";

const WALK_PREFIX = "walk.";
const VECTOR_SUFFIX = ".generated.svg";
const CELLS_SUFFIX = ".generated.json";
const SOURCE_PREFIX = "source.";
const SOURCE_SUFFIX = ".generated.txt";
const REFERENCES_PREFIX = "references.";
const RECORDS_PREFIX = "records.";
const PAGE_SEPARATOR = "__";
const PATH_SEPARATOR = "/";
const ROOT_PAGE = "code";

const writeCells = function writeCells(assets: WalkAssets, name: string, cells: readonly WalkCell[]): void {
    assets.cells.set(name, cells);
    assets.walks.set(name, JSON.stringify(packCells(cells)));
};

const walkRefOf = function walkRefOf(assets: WalkAssets, vector: string, cells: readonly WalkCell[]): WalkRef {
    const stem = digestedFileName(WALK_PREFIX, vector, "");
    const vectorName = stem + VECTOR_SUFFIX;
    const cellsName = stem + CELLS_SUFFIX;
    assets.walks.set(vectorName, vector);
    writeCells(assets, cellsName, cells);
    return { cells: cellsName, steps: cells.length, vector: vectorName };
};

export const pageIdOf = function pageIdOf(path: string): string {
    return path === "" ? ROOT_PAGE : path.split(PATH_SEPARATOR).join(PAGE_SEPARATOR);
};

export const folderWalkOf = function folderWalkOf(
    assets: WalkAssets,
    path: string,
    vectors: ReadonlyMap<string, string>,
    cells: ReadonlyMap<string, readonly WalkCell[]>,
): WalkRef | null {
    const id = pageIdOf(path);
    const vector = vectors.get(id);
    const walk = cells.get(id);
    return vector === undefined || walk === undefined ? null : walkRefOf(assets, vector, walk);
};

export const fileWalkOf = function fileWalkOf(
    assets: WalkAssets,
    entry: FileEntry | null,
    flagged: ReadonlyMap<string, string>,
): WalkRef | null {
    if (entry === null || entry.walk.length === 0) {
        return null;
    }
    return walkRefOf(assets, renderHexGrid(entry.walk, { flagged, title: entry.rel }), walkCells(entry.walk, flagged));
};

export const sourceOf = function sourceOf(assets: WalkAssets, text: string): string {
    const name = digestedFileName(SOURCE_PREFIX, text, SOURCE_SUFFIX);
    assets.sources.set(name, text);
    return name;
};

const qualifyCells = function qualifyCells(assets: WalkAssets, ref: WalkRef, qualify: (path: string) => string): void {
    const held = assets.cells.get(ref.cells);
    if (held === undefined) {
        return;
    }
    const cells = held.map((cell) => (cell.file.length === 0 ? cell : { ...cell, file: qualify(cell.file) }));
    writeCells(assets, ref.cells, cells);
};

export const qualifyWalks = function qualifyWalks(
    folder: AnatomyFolder,
    qualify: (path: string) => string,
    assets: WalkAssets,
): void {
    for (const ref of [folder.walk, ...folder.files.map((file) => file.walk)]) {
        if (ref !== null) {
            qualifyCells(assets, ref, qualify);
        }
    }
    for (const child of folder.folders) {
        qualifyWalks(child, qualify, assets);
    }
};

export const referencesAssetOf = function referencesAssetOf(assets: WalkAssets, references: SourceReferences): string {
    const text = JSON.stringify(references);
    const name = digestedFileName(REFERENCES_PREFIX, text, CELLS_SUFFIX);
    assets.sources.set(name, text);
    return name;
};

export const recordsAssetOf = function recordsAssetOf(assets: WalkAssets, records: AnatomyRecords): string {
    const text = JSON.stringify(records);
    const name = digestedFileName(RECORDS_PREFIX, text, CELLS_SUFFIX);
    assets.sources.set(name, text);
    return name;
};
