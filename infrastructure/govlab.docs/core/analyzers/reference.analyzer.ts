import type { BrokenRef, PathRef, PathsCtx } from "#types/reference.types";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { fileTokens } from "#core/parsers/metadata.parser";
import { isRelativeTarget } from "#core/predicates/reference.predicate";
import { normalizeTarget } from "#core/normalizers/reference.normalizer";
import { pathReferences } from "#core/parsers/location.parser";

const FM_LINE_OFFSET = 2;
const FENCE = "---";
const FENCE_CLOSE = "\n---";
const KEY_SEPARATOR = ":";
const WILDCARD = "*";
const HOME_MARK = "~";
const ROOT_MARK = "/";
const DEPENDENCY_DIR = "node_modules";
const FM_PROSE_FIELDS: ReadonlySet<string> = new Set(["description", "summary", "name", "title"]);

const extensionOf = function extensionOf(path: string): string {
    const dot = path.lastIndexOf(".");
    return dot === -1 ? "" : path.slice(dot);
};

const firstSegment = function firstSegment(path: string): string {
    const slash = path.indexOf("/");
    return slash === -1 ? path : path.slice(0, slash);
};

const existsBySuffix = function existsBySuffix(fileIndex: ReadonlyMap<string, string[]>, target: string): boolean {
    const suffix = `/${target}`;
    const candidates = fileIndex.get(target.slice(target.lastIndexOf("/") + 1)) ?? [];
    return candidates.some((relPath) => relPath === target || relPath.endsWith(suffix));
};

const existsFromAncestors = function existsFromAncestors(root: string, docPath: string, target: string): boolean {
    let dir = dirname(docPath);
    for (;;) {
        if (existsSync(join(dir, target))) {
            return true;
        }
        const parent = dirname(dir);
        if (dir === root || parent === dir) {
            return false;
        }
        dir = parent;
    }
};

const isOutOfScope = function isOutOfScope(context: PathsCtx, target: string): boolean {
    if (target === "" || target.startsWith(ROOT_MARK) || target.startsWith(HOME_MARK)) {
        return true;
    }
    return firstSegment(target) === DEPENDENCY_DIR || context.runtimeRoots.some((root) => target.startsWith(root));
};

const isCheckable = function isCheckable(context: PathsCtx, docPath: string, target: string): boolean {
    if (isOutOfScope(context, target)) {
        return false;
    }
    if (isRelativeTarget(target)) {
        return join(dirname(docPath), target).startsWith(context.root);
    }
    return context.codeExtensions.has(extensionOf(target)) || context.topLevel.has(firstSegment(target));
};

const targetFound = function targetFound(context: PathsCtx, docPath: string, target: string): boolean {
    if (isRelativeTarget(target)) {
        return existsSync(join(dirname(docPath), target));
    }
    return existsFromAncestors(context.root, docPath, target) || existsBySuffix(context.fileIndex, target);
};

const brokenRef = function brokenRef(context: PathsCtx, docPath: string, ref: PathRef): BrokenRef | null {
    const target = normalizeTarget(ref.path);
    if (!isCheckable(context, docPath, target) || targetFound(context, docPath, target)) {
        return null;
    }
    return { col: ref.col, line: ref.line, path: target };
};

export const brokenPaths = function brokenPaths(context: PathsCtx, docPath: string, source: string): BrokenRef[] {
    return pathReferences(source).flatMap((ref) => {
        const broken = brokenRef(context, docPath, ref);
        return broken === null ? [] : [broken];
    });
};

const tokenFound = function tokenFound(context: PathsCtx, docPath: string, token: string): boolean {
    return (
        existsSync(join(dirname(docPath), token)) ||
        existsBySuffix(context.fileIndex, token) ||
        existsFromAncestors(context.root, docPath, token)
    );
};

const lineFileRefs = function lineFileRefs(
    context: PathsCtx,
    docPath: string,
    line: string,
    index: number,
): BrokenRef[] {
    const colon = line.indexOf(KEY_SEPARATOR);
    if (colon !== -1 && FM_PROSE_FIELDS.has(line.slice(0, colon).trim())) {
        return [];
    }
    return fileTokens(line)
        .filter((token) => !token.includes(WILDCARD) && context.codeExtensions.has(extensionOf(token)))
        .filter((token) => !tokenFound(context, docPath, token))
        .map((token) => ({ col: 1, line: index + FM_LINE_OFFSET, path: token }));
};

export const frontmatterFileRefs = function frontmatterFileRefs(
    context: PathsCtx,
    docPath: string,
    source: string,
): BrokenRef[] {
    if (!source.startsWith(FENCE)) {
        return [];
    }
    const firstBreak = source.indexOf("\n");
    const end = firstBreak === -1 ? -1 : source.indexOf(FENCE_CLOSE, firstBreak);
    if (end === -1) {
        return [];
    }
    return source
        .slice(firstBreak + 1, end)
        .split("\n")
        .flatMap((line, index) => lineFileRefs(context, docPath, line, index));
};
