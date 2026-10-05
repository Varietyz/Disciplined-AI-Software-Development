import type { DirScan, Pruned } from "#types/package.types";
import { type Dirent, existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { detectLanguage } from "@govlab/code-parse";
import { isRecord } from "#core/predicates/record.predicate";
import process from "node:process";
import { unreadableManifest } from "#configuration/strings/report.strings";

const MANIFEST = "_manifest.json";
const PACKAGE = "package.json";
const TEST_PREFIX = "test_";
const NON_CODE: ReadonlySet<string> = new Set(["json", "yaml", "toml", "css", "html"]);
const TEST_DIRS: ReadonlySet<string> = new Set(["tests", "test", "__tests__", "spec", "testdata"]);
const TEST_MARKERS: readonly string[] = [".test.", ".spec.", ".stories.", "_test."];

const isShapedManifest = function isShapedManifest(value: unknown): boolean {
    return (
        isRecord(value) &&
        typeof value["label"] === "string" &&
        typeof value["maturity"] === "string" &&
        isRecord(value["visibility"])
    );
};

const readJsonSafe = function readJsonSafe(path: string): unknown {
    if (!existsSync(path)) {
        return null;
    }
    try {
        return JSON.parse(readFileSync(path, "utf8"));
    } catch (error) {
        process.stderr.write(unreadableManifest(path, String(error)));
        return null;
    }
};

export const discoverModules = function discoverModules(root: string, pruned: Pruned): string[] {
    const found: string[] = [];
    const stack: string[] = [root];
    let dir = stack.pop();
    while (dir !== undefined) {
        if (isShapedManifest(readJsonSafe(join(dir, MANIFEST)))) {
            found.push(resolve(dir));
        }
        const parent = dir;
        stack.push(
            ...readdirSync(parent, { withFileTypes: true })
                .filter((entry) => entry.isDirectory())
                .map((entry) => join(parent, entry.name))
                .filter((child) => !pruned(child)),
        );
        dir = stack.pop();
    }
    return found
        .filter((one) => !found.some((other) => other !== one && other.startsWith(one + sep)))
        .sort((a, b) => a.localeCompare(b));
};

export const buildPackageMap = function buildPackageMap(modules: readonly string[]): Map<string, string> {
    return new Map(
        modules.flatMap((dir): [string, string][] => {
            const parsed = readJsonSafe(join(dir, PACKAGE));
            return isRecord(parsed) && typeof parsed["name"] === "string" ? [[parsed["name"], dir]] : [];
        }),
    );
};

const isCodeFile = function isCodeFile(name: string): boolean {
    const language = detectLanguage(name);
    return language !== null && !NON_CODE.has(language);
};

const isTestFile = function isTestFile(name: string): boolean {
    return TEST_MARKERS.some((marker) => name.includes(marker)) || name.startsWith(TEST_PREFIX);
};

const isDescendable = function isDescendable(entry: Dirent, full: string, pruned: Pruned): boolean {
    return entry.isDirectory() && !pruned(full) && !TEST_DIRS.has(entry.name) && !existsSync(join(full, MANIFEST));
};

const bucketFor = function bucketFor(entry: Dirent, full: string, scan: DirScan, pruned: Pruned): string[] | null {
    if (isDescendable(entry, full, pruned)) {
        return scan.dirs;
    }
    if (!entry.isFile() || !isCodeFile(entry.name)) {
        return null;
    }
    return isTestFile(entry.name) ? scan.tests : scan.files;
};

const scanDir = function scanDir(dir: string, pruned: Pruned): DirScan {
    const scan: DirScan = { dirs: [], files: [], tests: [] };
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        bucketFor(entry, full, scan, pruned)?.push(full);
    }
    return scan;
};

const walk = function walk(moduleDir: string, pruned: Pruned, pick: (scan: DirScan) => string[]): string[] {
    const out: string[] = [];
    const stack: string[] = [moduleDir];
    let dir = stack.pop();
    while (dir !== undefined) {
        const scan = scanDir(dir, pruned);
        out.push(...pick(scan));
        stack.push(...scan.dirs);
        dir = stack.pop();
    }
    return out.sort((a, b) => a.localeCompare(b));
};

export const sourceFiles = function sourceFiles(moduleDir: string, pruned: Pruned): string[] {
    return walk(moduleDir, pruned, (scan) => scan.files);
};

export const testFilesOf = function testFilesOf(moduleDir: string, pruned: Pruned): string[] {
    return walk(moduleDir, pruned, (scan) => scan.tests);
};
