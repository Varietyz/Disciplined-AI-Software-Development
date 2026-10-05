import { BUILD_CLI, PARSER_SOURCE, WORK_PREFIX } from "#configuration/constants/grammar.constants";
import type { BuildResult, GrammarSource } from "#types/grammar.types";
import {
    UNKNOWN_FAILURE,
    builtLine,
    fetchFailedLine,
    noParserSource,
    noteOf,
    wasmFailedLine,
    wroteLine,
} from "#configuration/strings/grammar.strings";
import { dirname, join, relative } from "node:path";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { fileTypesForSource, readGrammarMeta } from "#core/loaders/manifest.loader";
import { grammarPath, resolveGrammarDir } from "#core/resolvers/grammar.resolver";
import { ROOT } from "@ssot/paths";
import { extensionMapOf } from "#core/converters/grammar.converter";
import { fetchGrammarPackage } from "#core/adapters/remote.adapter";
import process from "node:process";
import { reportBuild } from "#core/reporters/grammar.reporter";
import { runCommand } from "#core/adapters/shell.adapter";
import { tmpdir } from "node:os";

const messageOf = function messageOf(error: unknown): string {
    return error instanceof Error ? error.message : UNKNOWN_FAILURE;
};

const buildWasm = function buildWasm(source: GrammarSource, grammarDir: string): void {
    const out = grammarPath(resolveGrammarDir(), source.lang);
    if (existsSync(out)) {
        return;
    }
    if (!existsSync(join(grammarDir, ...PARSER_SOURCE))) {
        throw new Error(noParserSource(source.subdir));
    }
    runCommand("npx", ["--yes", BUILD_CLI, "build", "--wasm", grammarDir, "-o", out], dirname(grammarDir));
};

const attemptWasm = function attemptWasm(source: GrammarSource, grammarDir: string, fileTypes: string[]): BuildResult {
    try {
        buildWasm(source, grammarDir);
        process.stdout.write(builtLine(source.lang, fileTypes));
        return { fileTypes, kind: "built", lang: source.lang, note: source.lang };
    } catch (error) {
        process.stderr.write(wasmFailedLine(source.lang, messageOf(error)));
        return { fileTypes, kind: "wasm-failed", lang: source.lang, note: noteOf(source.lang, messageOf(error)) };
    }
};

const buildSource = function buildSource(source: GrammarSource, work: string): BuildResult {
    if (typeof source.unsupported === "string") {
        return { fileTypes: [], kind: "skipped", lang: source.lang, note: noteOf(source.lang, source.unsupported) };
    }
    const fetched = fetchGrammarPackage(source, join(work, source.lang));
    if ("error" in fetched) {
        process.stderr.write(fetchFailedLine(source.lang, fetched.error));
        return { fileTypes: [], kind: "fetch-failed", lang: source.lang, note: noteOf(source.lang, fetched.error) };
    }
    const grammarDir = typeof source.subdir === "string" ? join(fetched.root, source.subdir) : fetched.root;
    return attemptWasm(source, grammarDir, fileTypesForSource(source, readGrammarMeta(fetched.root)));
};

export const buildGrammars = async function buildGrammars(
    sources: readonly GrammarSource[],
    writeMap: (map: Record<string, string[]>) => Promise<string>,
): Promise<boolean> {
    const work = mkdtempSync(join(tmpdir(), WORK_PREFIX));
    mkdirSync(resolveGrammarDir(), { recursive: true });
    try {
        const results = sources.map((source) => buildSource(source, work));
        const map = extensionMapOf(results);
        const target = await writeMap(map);
        process.stdout.write(wroteLine(Object.keys(map).length, relative(ROOT, target)));
        return reportBuild(results);
    } finally {
        rmSync(work, { force: true, recursive: true });
    }
};
