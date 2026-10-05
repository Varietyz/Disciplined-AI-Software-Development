import { detectLanguage, ensureLanguages } from "@govlab/code-parse";
import type { CommentGrammar } from "#types/comment.types";
import type { PathExclusion } from "#types/exclusions.types";
import { absolutePath } from "@ssot/paths";
import { jsonRecord } from "#core/parsers/record.parser";
import path from "node:path";
import { readFileSync } from "node:fs";
import { recordsAt } from "#core/selectors/record.selector";
import { safeReaddir } from "#core/loaders/source.loader";

const GRAMMAR_FILE = "comment.data.json";

const toGrammar = function toGrammar(record: Record<string, unknown>): CommentGrammar[] {
    const { directivePrefixes, lang } = record;
    if (typeof lang !== "string" || !Array.isArray(directivePrefixes)) {
        return [];
    }
    return [{ directivePrefixes: directivePrefixes.filter((prefix) => typeof prefix === "string"), lang }];
};

export const commentGrammars = function commentGrammars(): Map<string, CommentGrammar> {
    const text = readFileSync(absolutePath("govlab.quality.data", GRAMMAR_FILE), "utf8");
    const records = recordsAt(jsonRecord(text), "grammars");
    return new Map(records.flatMap(toGrammar).map((grammar): [string, CommentGrammar] => [grammar.lang, grammar]));
};

export const langOf = function langOf(filePath: string): string | null {
    return detectLanguage(path.basename(filePath));
};

export const collectFiles = function collectFiles(root: string, excluded: PathExclusion): string[] {
    const out: string[] = [];
    const stack: string[] = [root];
    while (stack.length > 0) {
        const dir = stack.pop() ?? root;
        for (const entry of safeReaddir(dir)) {
            const full = path.join(dir, entry.name);
            const wanted = !excluded(full) && (entry.isDirectory() || langOf(entry.name) !== null);
            if (wanted) {
                (entry.isDirectory() ? stack : out).push(full);
            }
        }
    }
    return out;
};

export const preload = async function preload(files: readonly string[]): Promise<void> {
    const langs = files.map(langOf).filter((lang): lang is string => lang !== null);
    await ensureLanguages([...new Set(langs)]);
};
