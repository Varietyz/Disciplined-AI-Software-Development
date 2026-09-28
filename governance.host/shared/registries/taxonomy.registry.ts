import type { Jurisdiction, TaxonomySource, Vocabulary } from "../../types/taxonomy.types.ts";
import { assertMirrors, assertTaxonomy } from "../validators/taxonomy.validator.ts";
import { createVocabulary, importedRootsOf } from "../factories/vocabulary.factory.ts";
import { imports, taxonomy } from "../configs/taxonomy.config.ts";

interface RootEntry {
    readonly containers: ReadonlySet<string>;
    readonly foreign: ReadonlySet<string>;
    readonly root: string;
    readonly special: ReadonlySet<string>;
    readonly vocabulary: Vocabulary;
}

const hostEntries = function hostEntries(host: Vocabulary): readonly RootEntry[] {
    const declaredSpecial: Readonly<Record<string, readonly string[]>> = taxonomy.specialContainers;
    return Object.entries(taxonomy.containers).map(([root, names]) => ({
        containers: new Set<string>(names),
        foreign: new Set<string>(),
        root,
        special: new Set<string>(declaredSpecial[root]),
        vocabulary: host,
    }));
};

const importEntries = function importEntries(base: string, source: TaxonomySource): readonly RootEntry[] {
    const vocabulary = createVocabulary(source);
    const foreign = source.foreignContainers ?? {};
    return [...importedRootsOf(base, source)].map(([root, key]) => ({
        containers: new Set<string>(source.containers[key]),
        foreign: new Set<string>(foreign[key]),
        root,
        special: new Set<string>(source.specialContainers[key]),
        vocabulary,
    }));
};

const mirrorEntries = function mirrorEntries(
    mirrors: Readonly<Record<string, string>>,
    sources: readonly RootEntry[],
): readonly RootEntry[] {
    const byRoot = new Map(sources.map((entry) => [entry.root, entry]));
    return Object.entries(mirrors).flatMap(([mirror, source]) => {
        const entry = byRoot.get(source);
        return entry === undefined ? [] : [{ ...entry, root: mirror }];
    });
};

const assertHost = function assertHost(host: Vocabulary, entries: readonly RootEntry[]): void {
    assertTaxonomy(
        {
            byFolder: host.byFolder,
            byTag: host.byTag,
            compoundMarkers: host.compoundMarkers,
            containers: new Map(entries.map((entry) => [entry.root, entry.containers])),
            declaredContainers: taxonomy.containers,
            declaredSpecial: taxonomy.specialContainers,
            dialects: host.dialects,
            generatedFolder: host.generatedFolder,
            ignoredNames: host.ignoredNames,
            markerFolders: host.markerFolders,
            maxDepth: host.maxDepth,
            special: new Map(entries.map((entry) => [entry.root, entry.special])),
            splitters: taxonomy.grammar.splitters,
            subjects: host.subjects,
            fixtureMarkers: host.fixtureMarkers,
            testMarkers: host.testMarkers,
        },
        taxonomy.concerns.length,
    );
};

const buildJurisdiction = function buildJurisdiction(): Jurisdiction {
    const host = createVocabulary(taxonomy);
    const declared = hostEntries(host);
    assertHost(host, declared);
    const sources = [...declared, ...Object.entries(imports).flatMap(([base, source]) => importEntries(base, source))];
    assertMirrors(taxonomy.testMirrors, new Set(sources.map((entry) => entry.root)));
    const entries = [...sources, ...mirrorEntries(taxonomy.testMirrors, sources)];
    const containers = new Map(entries.map((entry) => [entry.root, entry.containers]));
    return {
        containers,
        foreign: new Map(entries.map((entry) => [entry.root, entry.foreign])),
        host,
        mirrors: new Map(Object.entries(taxonomy.testMirrors)),
        roots: [...containers.keys()].toSorted((a, b) => b.length - a.length),
        special: new Map(entries.map((entry) => [entry.root, entry.special])),
        vocabularies: new Map(entries.map((entry) => [entry.root, entry.vocabulary])),
    };
};

export const JURISDICTION: Jurisdiction = buildJurisdiction();
