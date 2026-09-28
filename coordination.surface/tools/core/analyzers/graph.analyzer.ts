import { dirname, resolve } from "node:path";
import { isFilesystemRefusal } from "../predicates/file.predicate.ts";

const CYCLE_JOIN = ">";
const IMPORT_LEAD = "import ";
const TYPE_IMPORT_LEAD = "import type ";
const FROM_MARK = 'from "';
const QUOTE = '"';
const RELATIVE_LEADS = ["./", "../"];

export const cyclesIn = function cyclesIn(edges: ReadonlyMap<string, ReadonlySet<string>>): string[][] {
    const out: string[][] = [];
    const reported = new Set<string>();

    const walk = (node: string, trail: readonly string[]): void => {
        const at = trail.indexOf(node);
        if (at !== -1) {
            const cycle = trail.slice(at);
            const marker = cycle.toSorted((left, right) => left.localeCompare(right)).join(CYCLE_JOIN);
            if (!reported.has(marker)) {
                reported.add(marker);
                out.push([...cycle]);
            }
            return;
        }
        if (trail.length > edges.size) {
            return;
        }
        for (const next of edges.get(node) ?? []) {
            walk(next, [...trail, node]);
        }
    };

    for (const node of edges.keys()) {
        walk(node, []);
    }
    return out;
};

const specifierIn = function specifierIn(line: string): string | null {
    const from = line.indexOf(FROM_MARK);
    if (from === -1) {
        return null;
    }
    const start = from + FROM_MARK.length;
    const end = line.indexOf(QUOTE, start);
    return end === -1 ? "" : line.slice(start, end);
};

const isRelative = function isRelative(specifier: string): boolean {
    return RELATIVE_LEADS.some((lead) => specifier.startsWith(lead));
};

export const localImports = function localImports(path: string, source: string, known: ReadonlySet<string>): string[] {
    const out = new Set<string>();
    const directory = dirname(path);
    let inside = false;

    for (const line of source.split("\n")) {
        inside ||= line.trim().startsWith(IMPORT_LEAD);
        const specifier = inside ? specifierIn(line) : null;
        if (specifier === null) {
            continue;
        }
        inside = false;
        const posix = isRelative(specifier) ? resolve(directory, specifier).replaceAll("\\", "/") : "";
        for (const candidate of known) {
            if (posix.length > 0 && posix.endsWith(candidate)) {
                out.add(candidate);
            }
        }
    }

    return [...out];
};

const withoutTypeImports = function withoutTypeImports(source: string): string {
    const out: string[] = [];
    let skipping = false;

    for (const line of source.split("\n")) {
        const trimmed = line.trim();
        skipping ||= trimmed.startsWith(TYPE_IMPORT_LEAD);
        if (!skipping) {
            out.push(line);
        }
        if (skipping && trimmed.includes(FROM_MARK)) {
            skipping = false;
        }
    }

    return out.join("\n");
};

export const moduleSource = function moduleSource(
    path: string,
    read: (path: string) => string,
    known: ReadonlySet<string>,
): string {
    const source = read(path);
    let combined = source;

    for (const imported of localImports(path, withoutTypeImports(source), known)) {
        try {
            combined += `\n${read(imported)}`;
        } catch (error) {
            if (!isFilesystemRefusal(error)) {
                throw error;
            }
        }
    }

    return combined;
};
