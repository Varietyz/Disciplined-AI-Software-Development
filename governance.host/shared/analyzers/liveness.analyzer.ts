import type { BarrelPattern, ClosureGraph, ExportEntry, ImportGraph, Reachable } from "../../types/closure.types.ts";
import { matchesBarrelPattern } from "../loaders/barrel.loader.ts";
import { normalizeImport } from "../loaders/graph.loader.ts";

const addEdge = function addEdge(graph: ImportGraph, file: string, from: string, names: string[]): void {
    const target = normalizeImport(file, from);
    if (target === null) {
        return;
    }
    const edges = graph.get(file) ?? [];
    edges.push({ names, target });
    graph.set(file, edges);
};

export const buildImportGraph = function buildImportGraph(closure: ClosureGraph): ImportGraph {
    const graph: ImportGraph = new Map();
    for (const imp of closure.imports) {
        addEdge(graph, imp.file, imp.from, imp.names);
    }
    for (const imp of closure.sideEffectImports) {
        addEdge(graph, imp.file, imp.from, []);
    }
    return graph;
};

export const findEntrypoints = function findEntrypoints(
    closure: ClosureGraph,
    entrySuffixes: readonly string[],
    barrels: readonly BarrelPattern[],
): Set<string> {
    const seen = new Set<string>();
    const allFiles = new Set<string>();
    for (const e of closure.exports) {
        allFiles.add(e.file);
    }
    for (const imp of closure.imports) {
        allFiles.add(imp.file);
    }
    for (const file of allFiles) {
        if (entrySuffixes.some((suffix) => file.endsWith(suffix)) || matchesBarrelPattern(file, barrels)) {
            seen.add(file);
        }
    }
    return seen;
};

export const walkReachable = function walkReachable(entrypoints: Iterable<string>, graph: ImportGraph): Reachable {
    const reachableFiles = new Set<string>();
    const reachableExports = new Set<string>();
    const stack = [...entrypoints];
    while (stack.length > 0) {
        const file = stack.pop();
        if (file === undefined || reachableFiles.has(file)) {
            continue;
        }
        reachableFiles.add(file);
        for (const imp of graph.get(file) ?? []) {
            for (const name of imp.names) {
                reachableExports.add(`${imp.target}::${name}`);
            }
            stack.push(imp.target);
        }
    }
    return { reachableExports, reachableFiles };
};

const externalReach = function externalReach(closure: ClosureGraph, graph: ImportGraph): string[] {
    const keys: string[] = [];
    for (const imp of closure.externalConsumers) {
        const target = normalizeImport(imp.file, imp.from);
        if (target === null) {
            continue;
        }
        for (const name of imp.names) {
            keys.push(`${target}::${name}`);
        }
        keys.push(...walkReachable([target], graph).reachableExports);
    }
    return keys;
};

export const computeDeadExports = function computeDeadExports(
    closure: ClosureGraph,
    entrySuffixes: readonly string[],
    barrels: readonly BarrelPattern[],
    isAllowed: (key: string) => boolean,
): ExportEntry[] {
    const graph = buildImportGraph(closure);
    const entrypoints = findEntrypoints(closure, entrySuffixes, barrels);
    const reachable = new Set([
        ...walkReachable(entrypoints, graph).reachableExports,
        ...externalReach(closure, graph),
    ]);
    return closure.exports.filter((e) => {
        const key = `${e.file}::${e.name}`;
        return !reachable.has(key) && !isAllowed(key);
    });
};
