import type { CodeParseOptions, CstNode, ParseAttempt, ParseLogger } from "#types/syntax.types";
import { Language, Parser, type Tree } from "web-tree-sitter";
import {
    NO_TREE,
    PARSE_FAILED,
    PARSE_INCOMPLETE,
    noGrammar,
    notPreloaded,
} from "#configuration/strings/syntax.strings";
import { grammarPath, resolveGrammarDir, runtimeWasm } from "#core/resolvers/grammar.resolver";
import { PARSE_ATTEMPTS } from "#configuration/constants/syntax.constants";
import { adaptNode } from "#core/adapters/syntax.adapter";
import { existsSync } from "node:fs";

const languageCache = new Map<string, Language>();
const inFlight = new Map<string, Promise<Language>>();
let initPromise: Promise<void> | null = null;
let loadChain: Promise<unknown> = Promise.resolve();

const ensureInit = async function ensureInit(): Promise<void> {
    initPromise ??= Parser.init({ locateFile: runtimeWasm });
    return initPromise;
};

const wasmFor = function wasmFor(language: string): string {
    return grammarPath(resolveGrammarDir(), language);
};

const loadLanguage = async function loadLanguage(wasm: string): Promise<Language> {
    const held = inFlight.get(wasm);
    if (held !== undefined) {
        return held;
    }
    const next = loadChain.then(async () => Language.load(wasm));
    loadChain = Promise.allSettled([next]);
    inFlight.set(wasm, next);
    return next;
};

const loadMissing = async function loadMissing(wasms: string[]): Promise<void> {
    const pending = wasms.filter((wasm) => !languageCache.has(wasm) && existsSync(wasm));
    const loaded = await Promise.all(pending.map(loadLanguage));
    pending.forEach((wasm, index) => {
        const language = loaded.at(index);
        if (language) {
            languageCache.set(wasm, language);
        }
    });
};

export const ensureLanguages = async function ensureLanguages(languages: Iterable<string>): Promise<void> {
    await ensureInit();
    await loadMissing([...new Set(languages)].map(wasmFor));
};

const adaptTree = function adaptTree(tree: Tree | null, sourceLength: number, logger?: ParseLogger): ParseAttempt {
    if (tree === null) {
        logger?.warn(NO_TREE);
        return { complete: false, root: null };
    }
    const node = tree.rootNode;
    const complete = node.startIndex === 0 && node.endIndex === sourceLength;
    const root = adaptNode(node);
    tree.delete();
    return { complete, root };
};

const parseOnce = function parseOnce(loaded: Language, source: string, logger?: ParseLogger): ParseAttempt {
    const parser = new Parser();
    try {
        parser.setLanguage(loaded);
        return adaptTree(parser.parse(source), source.length, logger);
    } finally {
        parser.delete();
    }
};

const runParser = function runParser(loaded: Language, source: string, logger?: ParseLogger): CstNode | null {
    let last: CstNode | null = null;
    for (let attempt = 0; attempt < PARSE_ATTEMPTS; attempt += 1) {
        try {
            const result = parseOnce(loaded, source, logger);
            last = result.root;
            if (result.complete) {
                return result.root;
            }
        } catch (error) {
            logger?.warn(PARSE_FAILED, error);
        }
    }
    logger?.warn(PARSE_INCOMPLETE);
    return last;
};

export const parseCodeSync = function parseCodeSync(
    source: string,
    language: string,
    options: CodeParseOptions = {},
): CstNode | null {
    const loaded = languageCache.get(wasmFor(language));
    if (!loaded) {
        throw new TypeError(notPreloaded(language));
    }
    return runParser(loaded, source, options.logger);
};

export const parseCode = async function parseCode(
    source: string,
    language: string,
    options: CodeParseOptions = {},
): Promise<CstNode | null> {
    const wasm = wasmFor(language);
    if (!existsSync(wasm)) {
        options.logger?.warn(noGrammar(language), wasm);
        return null;
    }
    await ensureLanguages([language]);
    return parseCodeSync(source, language, options);
};
