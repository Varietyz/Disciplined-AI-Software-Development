import {
    DOCUMENT_TYPE_CATEGORY,
    DOCUMENT_VERB_CATEGORY,
    NONTERMINAL_CLOSE,
} from "#configuration/constants/grammar.constants";
import type { DocumentTypeRecord, GrammarIssues, PagData } from "#types/grammar.types";
import { hasRoleIn, keywordIdOf } from "#core/selectors/grammar.selector";
import { NONTERMINAL_OPEN } from "#configuration/constants/algorithm.constants";
import { slotIsDangling } from "#core/resolvers/template.resolver";

const byName = function byName(a: string, b: string): number {
    return a.localeCompare(b);
};

const duplicateKeywords = function duplicateKeywords(data: PagData): string[] {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const id of data.keywords.map(keywordIdOf)) {
        if (seen.has(id)) {
            duplicates.push(id);
        }
        seen.add(id);
    }
    return duplicates;
};

const nonterminalRefs = function nonterminalRefs(rhs: string): string[] {
    const refs: string[] = [];
    let open = rhs.indexOf(NONTERMINAL_OPEN);
    while (open !== -1) {
        const close = rhs.indexOf(NONTERMINAL_CLOSE, open);
        if (close === -1) {
            break;
        }
        refs.push(rhs.slice(open + 1, close));
        open = rhs.indexOf(NONTERMINAL_OPEN, close + 1);
    }
    return refs;
};

const grammarSymbolsOf = function grammarSymbolsOf(
    data: PagData,
): Pick<GrammarIssues, "danglingNonterminals" | "unusedTerminals"> {
    const defined = new Set(data.productions.map((record) => record.lhs));
    const terminals = new Set(data.terminals);
    const refs = data.productions.flatMap((production) =>
        nonterminalRefs(production.rhs).map((ref) => ({ production: production.lhs, ref })),
    );
    const referenced = new Set(refs.map((entry) => entry.ref));
    return {
        danglingNonterminals: refs.filter((entry) => !defined.has(entry.ref) && !terminals.has(entry.ref)),
        unusedTerminals: [...terminals].filter((terminal) => !referenced.has(terminal)).toSorted(byName),
    };
};

const keywordValuesOf = function keywordValuesOf(data: PagData, category: string): Set<string> {
    return new Set(data.keywords.filter((record) => hasRoleIn(record, category)).map((record) => record.keyword));
};

const recognitionGaps = function recognitionGaps(
    data: PagData,
): Pick<GrammarIssues, "unrecognizedDocumentTypes" | "unrecognizedDocumentVerbs"> {
    const typeKeywords = keywordValuesOf(data, DOCUMENT_TYPE_CATEGORY);
    const verbKeywords = keywordValuesOf(data, DOCUMENT_VERB_CATEGORY);
    return {
        unrecognizedDocumentTypes: data.documentTypes
            .filter((record) => !typeKeywords.has(record.type))
            .map((record) => record.type)
            .toSorted(byName),
        unrecognizedDocumentVerbs: data.documentTypes
            .flatMap((record) => record.verbs.map((verb) => ({ type: record.type, verb })))
            .filter((entry) => !verbKeywords.has(entry.verb)),
    };
};

export const grammarIssuesOf = function grammarIssuesOf(
    data: PagData,
    typeByName: ReadonlyMap<string, DocumentTypeRecord>,
): GrammarIssues {
    return {
        ...recognitionGaps(data),
        ...grammarSymbolsOf(data),
        danglingTemplateSlots: data.templates.flatMap((template) =>
            template.slots
                .filter((slot) => slotIsDangling(template, slot))
                .map((slot) => ({ slot: slot.name, type: template.type })),
        ),
        docTypesWithoutVerb: data.documentTypes
            .filter((record) => record.defaultVerb === "" || record.verbs.length === 0)
            .map((record) => record.type),
        duplicateKeywordIds: duplicateKeywords(data),
        unknownTemplateTypes: data.templates
            .filter((template) => !typeByName.has(template.type))
            .map((template) => template.type),
    };
};
