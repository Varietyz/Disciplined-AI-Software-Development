import type { FileEntry, Pruned } from "#types/package.types";
import { existsSync, readFileSync } from "node:fs";
import { relative, sep } from "node:path";
import { sourceFiles, testFilesOf } from "#core/loaders/package.loader";
import type { IngestFile } from "#types/code.types";
import { MEANINGFUL_STATES } from "#configuration/constants/walk.constants";
import { identifierNames } from "#core/analyzers/syntax.analyzer";
import { ingestFile } from "#core/parsers/code.parser";
import { namedWalk } from "#core/converters/walk.converter";
import { stateOf } from "#core/classifiers/syntax.classifier";

const PATH_SEP = "/";

const queue: { tail: Promise<unknown> } = { tail: Promise.resolve() };

export const readSourceOrEmpty = function readSourceOrEmpty(file: string): string {
    return existsSync(file) ? readFileSync(file, "utf8") : "";
};

export const parseFile = async function parseFile(file: string): Promise<IngestFile> {
    const run = queue.tail.then(async () => ingestFile(readSourceOrEmpty(file), file));
    queue.tail = Promise.allSettled([run]);
    return run;
};

export const settleParses = async function settleParses(): Promise<void> {
    await queue.tail;
};

const isMeaningful = function isMeaningful(record: Record<string, unknown>): boolean {
    const { nodeType } = record;
    return MEANINGFUL_STATES.has(stateOf(typeof nodeType === "string" ? nodeType : ""));
};

const entryFor = function entryFor(file: string, moduleDir: string, parsed: IngestFile): FileEntry {
    const rel = relative(moduleDir, file).split(sep).join(PATH_SEP);
    const records = parsed.records.map((record) => ({ ...record, file: rel }));
    const symbols = parsed.symbols.map((symbol) => ({ ...symbol, file: rel }));
    return { records, rel, symbols, walk: namedWalk(records.filter(isMeaningful), symbols) };
};

export const entriesFor = async function entriesFor(moduleDir: string, pruned: Pruned): Promise<FileEntry[]> {
    return Promise.all(
        sourceFiles(moduleDir, pruned).map(async (file) => entryFor(file, moduleDir, await parseFile(file))),
    );
};

export const testUsesOf = async function testUsesOf(moduleDir: string, pruned: Pruned): Promise<Set<string>> {
    const parsed = await Promise.all(testFilesOf(moduleDir, pruned).map(async (file) => parseFile(file)));
    return new Set(parsed.flatMap((entry) => identifierNames(entry.records)));
};
