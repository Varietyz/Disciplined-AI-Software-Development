import { join, relative, sep } from "node:path";
import { readFileSync, readdirSync, statSync } from "node:fs";
import type { WalkOptions } from "../types/file.types.ts";
import { isFilesystemRefusal } from "../predicates/file.predicate.ts";

type EntryKind = "directory" | "file" | "other";

interface Listed {
    readonly entry: string;
    readonly full: string;
    readonly kind: EntryKind;
}

interface Listing {
    readonly directories: readonly string[];
    readonly files: readonly string[];
}

const endsWithAny = function endsWithAny(name: string, suffixes: readonly string[]): boolean {
    return suffixes.some((suffix) => name.length > suffix.length && name.endsWith(suffix));
};

const kept = function kept(entry: string, options: WalkOptions): boolean {
    const excluded = options.excluded !== undefined && endsWithAny(entry, options.excluded);
    return !excluded && (options.extensions.length === 0 || endsWithAny(entry, options.extensions));
};

const entriesOf = function entriesOf(directory: string): string[] {
    try {
        return readdirSync(directory);
    } catch (error) {
        if (isFilesystemRefusal(error)) {
            return [];
        }
        throw error;
    }
};

const kindOf = function kindOf(full: string): EntryKind {
    try {
        const info = statSync(full);
        if (info.isDirectory()) {
            return "directory";
        }
        return info.isFile() ? "file" : "other";
    } catch (error) {
        if (isFilesystemRefusal(error)) {
            return "other";
        }
        throw error;
    }
};

const listingOf = function listingOf(directory: string, options: WalkOptions): Listing {
    const listed: Listed[] = entriesOf(directory)
        .filter((entry) => !options.ignored.includes(entry))
        .map((entry) => {
            const full = join(directory, entry);
            return { entry, full, kind: kindOf(full) };
        });

    return {
        directories: listed.filter((item) => item.kind === "directory").map((item) => item.full),
        files: listed.filter((item) => item.kind === "file" && kept(item.entry, options)).map((item) => item.full),
    };
};

export const walk = function walk(options: WalkOptions): string[] {
    const found: string[] = [];
    const stack: string[] = [options.root];
    let directory = stack.pop();

    while (directory !== undefined) {
        const listing = listingOf(directory, options);
        found.push(...listing.files);
        stack.push(...listing.directories);
        directory = stack.pop();
    }

    return found.toSorted((left, right) => left.localeCompare(right, "en"));
};

export const readSource = function readSource(path: string): string {
    return readFileSync(path, "utf8");
};

export const forwardSlashed = function forwardSlashed(text: string): string {
    return text.replaceAll("\\", "/");
};

export const toPosix = function toPosix(root: string, path: string): string {
    const rel = relative(root, path);
    return sep === "/" ? rel : forwardSlashed(rel);
};
