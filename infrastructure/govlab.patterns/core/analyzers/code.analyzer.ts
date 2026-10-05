import type { CallEdge, CodeGraph, CodeInsight, CodeSymbol, ExternalCall, SymbolStat } from "#types/code.types";
import { ROLE_CALL, ROLE_DEFINITION } from "#core/classifiers/syntax.classifier";
import { MODULE_SCOPE } from "#configuration/constants/report.constants";
import { increment } from "#core/counters/base.counter";
import { keyOf } from "#core/formatters/definition.formatter";
import { syntaxDistribution } from "#core/analyzers/syntax.analyzer";

const FLOW_ENTRY = "entry";
const FLOW_RELAY = "relay";
const FLOW_LEAF = "leaf";
const FLOW_ISOLATED = "isolated";

const flowOf = function flowOf(inDegree: number, outDegree: number): string {
    if (inDegree === 0) {
        return outDegree === 0 ? FLOW_ISOLATED : FLOW_ENTRY;
    }
    return outDegree === 0 ? FLOW_LEAF : FLOW_RELAY;
};

const definitionKeys = function definitionKeys(symbols: readonly CodeSymbol[]): Map<string, CodeSymbol> {
    return new Map(
        symbols
            .filter((symbol) => symbol.role === ROLE_DEFINITION)
            .map((symbol) => [keyOf(symbol.file, symbol.name), symbol]),
    );
};

const definitionFiles = function definitionFiles(symbols: readonly CodeSymbol[]): Map<string, Set<string>> {
    const map = new Map<string, Set<string>>();
    for (const symbol of symbols.filter((entry) => entry.role === ROLE_DEFINITION)) {
        map.set(symbol.name, (map.get(symbol.name) ?? new Set<string>()).add(symbol.file));
    }
    return map;
};

const uniqueKeyByName = function uniqueKeyByName(defFiles: ReadonlyMap<string, Set<string>>): Map<string, string> {
    const out = new Map<string, string>();
    for (const [name, files] of defFiles) {
        const [only] = [...files];
        if (files.size === 1 && only !== undefined) {
            out.set(name, keyOf(only, name));
        }
    }
    return out;
};

const externalFrom = function externalFrom(symbol: CodeSymbol): ExternalCall {
    return { caller: symbol.enclosing, file: symbol.file, line: symbol.line, name: symbol.name };
};

export const codeGraph = function codeGraph(symbols: readonly CodeSymbol[]): CodeGraph {
    const defKeys = definitionKeys(symbols);
    const defFiles = definitionFiles(symbols);
    const unique = uniqueKeyByName(defFiles);
    const calls = symbols.filter(
        (symbol) =>
            symbol.role === ROLE_CALL &&
            !symbol.member &&
            defKeys.get(keyOf(symbol.file, symbol.enclosing))?.callable === true,
    );
    const edges = calls.flatMap((call): CallEdge[] => {
        const same = keyOf(call.file, call.name);
        const to = defKeys.has(same) ? same : (unique.get(call.name) ?? "");
        const from = keyOf(call.file, call.enclosing);
        return to === "" || to === from ? [] : [{ file: call.file, from, line: call.line, to }];
    });
    return { edges, external: calls.filter((call) => !defFiles.has(call.name)).map(externalFrom) };
};

const byPosition = function byPosition(a: SymbolStat, b: SymbolStat): number {
    return a.file.localeCompare(b.file) || a.line - b.line || a.name.localeCompare(b.name);
};

const byDegree = function byDegree(a: SymbolStat, b: SymbolStat): number {
    return b.inDegree - a.inDegree || b.outDegree - a.outDegree || byPosition(a, b);
};

const toStat = function toStat(symbol: CodeSymbol, inDegree: number, outDegree: number): SymbolStat {
    return {
        callable: symbol.callable,
        exported: symbol.exported,
        file: symbol.file,
        flow: flowOf(inDegree, outDegree),
        inDegree,
        kind: symbol.kind,
        line: symbol.line,
        local: symbol.enclosing !== MODULE_SCOPE,
        name: symbol.name,
        outDegree,
        role: symbol.role,
    };
};

export const codeInsight = function codeInsight(
    symbols: readonly CodeSymbol[],
    records: readonly Record<string, unknown>[],
): CodeInsight {
    const defKeys = definitionKeys(symbols);
    const { edges } = codeGraph(symbols);
    const inDeg = new Map<string, number>();
    const outDeg = new Map<string, number>();
    for (const edge of edges) {
        increment(outDeg, edge.from);
        increment(inDeg, edge.to);
    }
    const stats = [...defKeys].map(([key, symbol]) => toStat(symbol, inDeg.get(key) ?? 0, outDeg.get(key) ?? 0));
    const distribution = syntaxDistribution(records);
    return {
        definitions: defKeys.size,
        edges: edges.length,
        invariants: distribution.invariants,
        symbols: stats.toSorted(byDegree),
        variants: distribution.variants,
    };
};
