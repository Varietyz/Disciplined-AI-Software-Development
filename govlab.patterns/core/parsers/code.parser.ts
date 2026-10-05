import { type CodeParseOptions, type CstNode, detectLanguage, parseCode } from "@govlab/code-parse";
import type { CodeSymbol, ImportBinding, IngestFile } from "#types/code.types";
import { codeImports } from "#core/parsers/dependency.parser";
import { codeRecords } from "#core/parsers/syntax.parser";
import { codeSymbols } from "#core/parsers/definition.parser";

interface ParsedSource {
    language: string;
    root: CstNode;
}

const parsedSource = async function parsedSource(
    source: string,
    filename: string,
    options: CodeParseOptions,
): Promise<ParsedSource | null> {
    const language = detectLanguage(filename, source);
    if (language === null) {
        return null;
    }
    const root = await parseCode(source, language, options);
    return root === null ? null : { language, root };
};

export const ingestCode = async function ingestCode(
    source: string,
    filename: string,
    options: CodeParseOptions = {},
): Promise<Record<string, unknown>[]> {
    const parsed = await parsedSource(source, filename, options);
    return parsed === null ? [] : codeRecords(parsed.root, parsed.language);
};

export const ingestSymbols = async function ingestSymbols(
    source: string,
    filename: string,
    options: CodeParseOptions = {},
): Promise<CodeSymbol[]> {
    const parsed = await parsedSource(source, filename, options);
    return parsed === null ? [] : codeSymbols(parsed.root);
};

export const ingestImports = async function ingestImports(
    source: string,
    filename: string,
    options: CodeParseOptions = {},
): Promise<ImportBinding[]> {
    const parsed = await parsedSource(source, filename, options);
    return parsed === null ? [] : codeImports(parsed.root);
};

export const ingestFile = async function ingestFile(
    source: string,
    filename: string,
    options: CodeParseOptions = {},
): Promise<IngestFile> {
    const parsed = await parsedSource(source, filename, options);
    if (parsed === null) {
        return { imports: [], records: [], symbols: [] };
    }
    const { language, root } = parsed;
    return { imports: codeImports(root), records: codeRecords(root, language), symbols: codeSymbols(root) };
};
