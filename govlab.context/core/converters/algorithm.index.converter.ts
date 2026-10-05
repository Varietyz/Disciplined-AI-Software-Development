import {
    ALTERNATIVE_SEPARATOR,
    MIN_QUOTED_LENGTH,
    NONTERMINAL_OPEN,
    QUOTE,
    QUOTE_PAIR_COUNT,
    SYMBOL_NAME_SEPARATOR,
} from "#configuration/constants/algorithm.constants";
import type { ContractSymbolView, SymbolEntry } from "#types/algorithm.types";

interface SymbolAccumulator {
    grammar: string;
    records: Set<string>;
    rhsSet: Set<string>;
}

const isSingleQuotedLiteral = function isSingleQuotedLiteral(part: string): boolean {
    const trimmed = part.trim();
    if (trimmed.length < MIN_QUOTED_LENGTH || !trimmed.startsWith(QUOTE) || !trimmed.endsWith(QUOTE)) {
        return false;
    }
    let quotes = 0;
    for (const ch of trimmed) {
        if (ch === QUOTE) {
            quotes += 1;
        }
    }
    return quotes === QUOTE_PAIR_COUNT;
};

const enumValues = function enumValues(rhs: string): string[] | null {
    const parts = rhs.split(ALTERNATIVE_SEPARATOR);
    return parts.every(isSingleQuotedLiteral) ? parts.map((part) => part.trim().slice(1, -1)) : null;
};

const accumulateSymbols = function accumulateSymbols(
    contracts: readonly ContractSymbolView[],
): Map<string, SymbolAccumulator> {
    const accumulators = new Map<string, SymbolAccumulator>();
    for (const contract of contracts) {
        for (const production of contract.productions) {
            const key = `${contract.domain}${SYMBOL_NAME_SEPARATOR}${production.lhs}`;
            const entry = accumulators.get(key) ?? {
                grammar: contract.domain,
                records: new Set<string>(),
                rhsSet: new Set<string>(),
            };
            entry.records.add(contract.id);
            entry.rhsSet.add(production.rhs);
            accumulators.set(key, entry);
        }
    }
    return accumulators;
};

const toSymbolEntry = function toSymbolEntry(name: string, accumulator: SymbolAccumulator): SymbolEntry {
    const [rhs = ""] = [...accumulator.rhsSet].toSorted((a, b) => a.localeCompare(b));
    const definedIn = [...accumulator.records].toSorted((a, b) => a.localeCompare(b));
    const values = rhs.includes(NONTERMINAL_OPEN) ? null : enumValues(rhs);
    return values
        ? { definedIn, grammar: accumulator.grammar, kind: "enum", name, values }
        : { definedIn, grammar: accumulator.grammar, kind: "composite", name, rhs };
};

export const buildSymbolIndex = function buildSymbolIndex(contracts: readonly ContractSymbolView[]): SymbolEntry[] {
    return [...accumulateSymbols(contracts)]
        .map(([key, accumulator]) => toSymbolEntry(key.slice(key.indexOf(SYMBOL_NAME_SEPARATOR) + 1), accumulator))
        .toSorted((left, right) => left.grammar.localeCompare(right.grammar) || left.name.localeCompare(right.name));
};
