import type { Contract, SymbolEntry } from "#types/algorithm.types";
import { DISTINCT_UNKNOWN_CONTRACT, DISTINCT_UNREASONED } from "#configuration/strings/validation.strings";
import type { IntegrityIssues } from "#types/validation.types";
import { buildSymbolIndex } from "#core/converters/algorithm.index.converter";
import { symbolIndexesMatch } from "#core/predicates/algorithm.predicate";

interface IntegrityFaces {
    algo: { all: () => readonly Contract[]; symbols: () => readonly SymbolEntry[] };
}

interface GrammarSymbolSite {
    rhsSet: Set<string>;
    records: Set<string>;
}

const CROSS_CATALOG_A = "architecture";
const CROSS_CATALOG_B = "arch-relationships";
const TITLE_STOPWORDS: ReadonlySet<string> = new Set([
    "and",
    "or",
    "the",
    "of",
    "a",
    "an",
    "to",
    "for",
    "with",
    "in",
    "on",
]);
const TITLE_OVERLAP_MIN = 2;
const MIN_TOKEN_LENGTH = 2;
const WORD_SEPARATOR = " ";

const byName = function byName(a: string, b: string): number {
    return a.localeCompare(b);
};

const groupSymbolsByGrammar = function groupSymbolsByGrammar(
    faces: IntegrityFaces,
): Map<string, Map<string, GrammarSymbolSite>> {
    const byGrammar = new Map<string, Map<string, GrammarSymbolSite>>();
    for (const contract of faces.algo.all()) {
        const grammar = byGrammar.get(contract.domain) ?? new Map<string, GrammarSymbolSite>();
        for (const production of contract.productions) {
            const site = grammar.get(production.lhs) ?? { records: new Set<string>(), rhsSet: new Set<string>() };
            site.rhsSet.add(production.rhs);
            site.records.add(contract.id);
            grammar.set(production.lhs, site);
        }
        byGrammar.set(contract.domain, grammar);
    }
    return byGrammar;
};

const intraGrammarDivergentOf = function intraGrammarDivergentOf(
    faces: IntegrityFaces,
): IntegrityIssues["intraGrammarDivergentSymbols"] {
    return [...groupSymbolsByGrammar(faces)]
        .flatMap(([grammar, symbols]) =>
            [...symbols]
                .filter(([, site]) => site.rhsSet.size > 1)
                .map(([name, site]) => ({ definedIn: [...site.records].toSorted(byName), grammar, name })),
        )
        .toSorted((a, b) => a.grammar.localeCompare(b.grammar) || a.name.localeCompare(b.name));
};

const titleTokens = function titleTokens(title: string): Set<string> {
    return new Set(
        title
            .toLowerCase()
            .split(WORD_SEPARATOR)
            .map((raw) => raw.trim())
            .filter((token) => token.length > MIN_TOKEN_LENGTH && !TITLE_STOPWORDS.has(token)),
    );
};

const tokenOverlap = function tokenOverlap(tokensA: Set<string>, tokensB: Set<string>): number {
    return [...tokensA].filter((token) => tokensB.has(token)).length;
};

const crossCatalogRedundancyOf = function crossCatalogRedundancyOf(faces: IntegrityFaces): { a: string; b: string }[] {
    const catalogA = faces.algo.all().filter((contract) => contract.domain === CROSS_CATALOG_A);
    const catalogB = faces.algo.all().filter((contract) => contract.domain === CROSS_CATALOG_B);
    return catalogA
        .flatMap((a) => {
            const tokensA = titleTokens(a.title);
            return catalogB
                .filter((b) => tokenOverlap(tokensA, titleTokens(b.title)) >= TITLE_OVERLAP_MIN)
                .map((b) => ({ a: a.id, b: b.id }));
        })
        .toSorted((x, y) => x.a.localeCompare(y.a) || x.b.localeCompare(y.b));
};

const declaresDistinct = function declaresDistinct(contract: Contract | undefined, other: string): boolean {
    return (contract?.distinctFrom ?? []).some((entry) => entry.id === other && entry.reason.trim().length > 0);
};

const invalidDistinctDeclarationsOf = function invalidDistinctDeclarationsOf(
    faces: IntegrityFaces,
): IntegrityIssues["invalidDistinctDeclarations"] {
    const ids = new Set(faces.algo.all().map((contract) => contract.id));
    return faces.algo.all().flatMap((contract) =>
        (contract.distinctFrom ?? []).flatMap((entry) => {
            if (!ids.has(entry.id)) {
                return [{ from: contract.id, reason: DISTINCT_UNKNOWN_CONTRACT, target: entry.id }];
            }
            return entry.reason.trim().length === 0
                ? [{ from: contract.id, reason: DISTINCT_UNREASONED, target: entry.id }]
                : [];
        }),
    );
};

export const integrityIssuesOf = function integrityIssuesOf(faces: IntegrityFaces): IntegrityIssues {
    const intraGrammarDivergentSymbols = intraGrammarDivergentOf(faces);
    const byId = new Map(faces.algo.all().map((contract) => [contract.id, contract]));
    const crossCatalogRedundancy = crossCatalogRedundancyOf(faces).filter(
        (pair) => !declaresDistinct(byId.get(pair.a), pair.b) && !declaresDistinct(byId.get(pair.b), pair.a),
    );
    const invalidDistinctDeclarations = invalidDistinctDeclarationsOf(faces);
    const generatedIndex = buildSymbolIndex(faces.algo.all());
    const committedIndex = faces.algo.symbols();
    const symbolIndexStale = !symbolIndexesMatch(committedIndex, generatedIndex);
    return {
        crossCatalogRedundancy,
        indexedSymbolCount: committedIndex.length,
        intraGrammarDivergentSymbols,
        invalidDistinctDeclarations,
        liveSymbolCount: generatedIndex.length,
        subtotal:
            intraGrammarDivergentSymbols.length +
            crossCatalogRedundancy.length +
            invalidDistinctDeclarations.length +
            (symbolIndexStale ? 1 : 0),
        symbolIndexStale,
    };
};
