import {
    AMERICAN_WORDS,
    IZE_STEMS,
    IZE_SUFFIXES,
    PLURAL_IES,
    PLURAL_KEPT_AFTER,
    PLURAL_MINIMUM_LENGTH,
    PLURAL_SUFFIX,
    SPELLING_PREFIXES,
} from "@govlab/constants";
import type { Identity, Leaf, Linker } from "#types/catalog.types";
import type { Phrase, SearchEntry, SearchRules, SearchSection } from "#types/search.types";
import { QUERY_ENDPOINT, QUERY_FUZZY, QUERY_LIMITS, SEARCH_KIND } from "#configuration/constants/catalog.constants";
import { QUERY_MESSAGES, QUERY_TITLE, queryParametersOf } from "#configuration/strings/catalog.strings";
import type { NamedSource } from "#types/source.types";
import type { WebModules } from "#types/loader.types";
import { groupedBy } from "#core/converters/base.converter";
import { queryIndex } from "#core/resolvers/catalog.resolver";

const QUERY_REF = "api:query";

type Words = (text: string) => readonly string[];

export const searchSections = async function searchSections(
    web: Pick<WebModules, "analyzer" | "corpus" | "matcher" | "search">,
): Promise<readonly SearchSection[]> {
    const index = web.search.indexOf(await web.corpus.loadCorpus());
    return index.sources.flatMap((source) =>
        source.tab.sections.map((section) => ({
            href: web.analyzer.anchorPath(source, section.id),
            position: web.search.positionOf(index, source, section),
            words: web.analyzer.textsOf(section).flatMap((text) => web.matcher.markupWords(text)),
        })),
    );
};

export const searchRulesOf = function searchRulesOf(
    web: Pick<WebModules, "searchConstants" | "vocabulary">,
): SearchRules {
    return {
        americanWords: AMERICAN_WORDS,
        fuzzyMinimum: web.searchConstants.FUZZY_MIN_TERM_LENGTH,
        izeStems: IZE_STEMS,
        izeSuffixes: IZE_SUFFIXES,
        pluralIes: PLURAL_IES,
        pluralKeptAfter: [...PLURAL_KEPT_AFTER],
        pluralMinimum: PLURAL_MINIMUM_LENGTH,
        pluralSuffix: PLURAL_SUFFIX,
        spellingPrefixes: SPELLING_PREFIXES,
        wordCharacters: web.vocabulary.WORD_CHARACTERS,
    };
};

const byPosition = function byPosition(left: SearchEntry, right: SearchEntry): number {
    return (left.position ?? Number.POSITIVE_INFINITY) - (right.position ?? Number.POSITIVE_INFINITY);
};

export const sectionEntries = function sectionEntries(
    sections: readonly SearchSection[],
    linker: Linker,
): readonly SearchEntry[] {
    return sections
        .flatMap((section) => {
            const identity = linker.byHref(section.href);
            const position = Number.isFinite(section.position) ? section.position : null;
            return identity === null ? [] : [{ identity, position, words: section.words }];
        })
        .toSorted(byPosition);
};

export const recordEntries = function recordEntries(
    records: readonly Identity[],
    phrases: readonly Phrase[],
    words: Words,
): readonly SearchEntry[] {
    const aliases = groupedBy(phrases, (phrase) => phrase.ref);
    return records.map((identity) => ({
        identity,
        position: null,
        words: [
            identity.title,
            identity.summary ?? "",
            ...(aliases.get(identity.ref) ?? []).map((alias) => alias.phrase),
        ].flatMap(words),
    }));
};

export const fileEntries = function fileEntries(files: readonly NamedSource[], words: Words): readonly SearchEntry[] {
    return files
        .map(({ file, identity }) => ({
            identity,
            position: null,
            words: [file.path, ...file.definitions.map((definition) => definition.name)].flatMap(words),
        }))
        .toSorted((left, right) => left.identity.title.localeCompare(right.identity.title));
};

const sortedUnique = function sortedUnique(values: readonly string[]): readonly string[] {
    return [...new Set(values)].toSorted((left, right) => left.localeCompare(right));
};

export const queryLeaf = function queryLeaf(site: string, relations: readonly string[]): Leaf {
    const ref = QUERY_REF;
    const data = {
        endpoint: site + QUERY_ENDPOINT,
        fuzzy: QUERY_FUZZY,
        index: site + queryIndex().json,
        limits: QUERY_LIMITS,
        messages: QUERY_MESSAGES,
        parameters: queryParametersOf(QUERY_LIMITS),
        ref,
        relations: sortedUnique(relations),
        site,
        title: QUERY_TITLE,
    };
    return {
        data,
        identity: { address: queryIndex(), href: null, kind: SEARCH_KIND, ref, summary: null, title: QUERY_TITLE },
        markdown: null,
    };
};
