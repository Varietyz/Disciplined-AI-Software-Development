import { REFERENCE_DELIMITERS, REFERENCE_ENDS, TEXT_EXTENSIONS } from "#configuration/constants/asset.constants";
import { extensionOf, stripCompression, toPosix } from "#core/resolvers/asset.resolver";
import { posix, resolve } from "node:path";
import { isServed } from "#core/predicates/asset.predicate";
import { readFileSync } from "node:fs";
import { walk } from "#core/loaders/asset.loader";

const SLASH = "/";
const SIBLING_STEP = "./";
const PARENT_STEP = "../";
const ASCII = 128;
const TEXT_END = -1;

const codeTable = function codeTable(characters: ReadonlySet<string>): Uint8Array {
    const table = new Uint8Array(ASCII);
    for (const character of characters) {
        table[character.codePointAt(0) ?? 0] = 1;
    }
    return table;
};

const DELIMITERS = codeTable(REFERENCE_DELIMITERS);
const ENDS = codeTable(REFERENCE_ENDS);
const SLASH_CODE = SLASH.codePointAt(0) ?? 0;

const isIn = function isIn(table: Uint8Array, code: number): boolean {
    return code >= 0 && code < ASCII && table[code] === 1;
};

const nameOf = function nameOf(path: string): string {
    return path.slice(path.lastIndexOf(SLASH) + 1);
};

const referencesPath = function referencesPath(path: string, from: string, candidate: string): boolean {
    if (path.startsWith(SIBLING_STEP) || path.startsWith(PARENT_STEP)) {
        return posix.normalize(posix.join(posix.dirname(from), path)) === candidate;
    }
    const bare = path.startsWith(SLASH) ? path.slice(1) : path;
    return bare === candidate || path.endsWith(SLASH + candidate) || candidate.endsWith(SLASH + bare);
};

interface Token {
    readonly start: number;
    readonly lastSlash: number;
    readonly pathEnd: number;
}

const tokenFrom = function tokenFrom(start: number): Token {
    return { lastSlash: TEXT_END, pathEnd: TEXT_END, start };
};

const codeAt = function codeAt(text: string, index: number): number {
    return index === text.length ? TEXT_END : (text.codePointAt(index) ?? TEXT_END);
};

const tokenReferences = function tokenReferences(
    text: string,
    token: Token,
    index: number,
    target: { readonly from: string; readonly byName: ReadonlyMap<string, readonly string[]> },
): string[] {
    const end = token.pathEnd === TEXT_END ? index : token.pathEnd;
    const nameStart = token.lastSlash === TEXT_END ? token.start : token.lastSlash + 1;
    const candidates = end > nameStart ? target.byName.get(text.slice(nameStart, end)) : undefined;
    if (candidates === undefined) {
        return [];
    }
    const path = text.slice(token.start, end);
    return candidates.filter((held) => referencesPath(path, target.from, held));
};

const extended = function extended(token: Token, code: number, index: number): Token {
    if (token.pathEnd !== TEXT_END) {
        return token;
    }
    if (code === SLASH_CODE) {
        return { ...token, lastSlash: index };
    }
    return isIn(ENDS, code) ? { ...token, pathEnd: index } : token;
};

export const referencesIn = function referencesIn(
    text: string,
    from: string,
    byName: ReadonlyMap<string, readonly string[]>,
): Set<string> {
    const found = new Set<string>();
    const target = { byName, from };
    let token = tokenFrom(0);
    for (let index = 0; index <= text.length; index += 1) {
        const code = codeAt(text, index);
        if (code === TEXT_END || isIn(DELIMITERS, code)) {
            for (const candidate of tokenReferences(text, token, index, target)) {
                found.add(candidate);
            }
            token = tokenFrom(index + 1);
        } else {
            token = extended(token, code, index);
        }
    }
    return found;
};

const namesOf = function namesOf(files: Iterable<string>): Map<string, string[]> {
    const byName = new Map<string, string[]>();
    for (const file of files) {
        const name = nameOf(file);
        byName.set(name, [...(byName.get(name) ?? []), file]);
    }
    return byName;
};

const reachable = function reachable(outDir: string, files: readonly string[]): Set<string> {
    const plain = new Set(files.map(stripCompression));
    const kept = new Set([...plain].filter(isServed));
    const pending = new Set([...plain].filter((file) => !kept.has(file)));
    const byName = namesOf(pending);
    const queue = [...kept];
    while (queue.length > 0 && pending.size > 0) {
        const file = queue.pop();
        if (file === undefined || !TEXT_EXTENSIONS.has(extensionOf(file))) {
            continue;
        }
        for (const reference of referencesIn(readFileSync(resolve(outDir, file), "utf8"), file, byName)) {
            if (pending.delete(reference)) {
                kept.add(reference);
                queue.push(reference);
            }
        }
    }
    return kept;
};

export const unreferencedFiles = function unreferencedFiles(outDir: string): string[] {
    const files = walk(outDir, outDir).map(toPosix);
    const kept = reachable(outDir, files);
    return files.filter((file) => !kept.has(stripCompression(file))).sort((a, b) => a.localeCompare(b));
};
