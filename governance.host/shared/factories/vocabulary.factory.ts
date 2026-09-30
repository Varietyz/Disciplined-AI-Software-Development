import type { Concern, GrammarRoles, TaxonomySource, Vocabulary } from "../../types/taxonomy.types.ts";

const DEPTH_KEYS = ["depthOne", "depthTwo", "depthThree", "depthFour"] as const;

const IMPORT_SELF = ".";

export const importedRootsOf = function importedRootsOf(base: string, source: TaxonomySource): Map<string, string> {
    const keys = new Set([
        ...Object.keys(source.containers),
        ...Object.keys(source.specialContainers),
        ...Object.keys(source.foreignContainers ?? {}),
    ]);
    return new Map([...keys].map((key) => [key === IMPORT_SELF ? base : `${base}/${key}`, key]));
};

const roleOf = function roleOf(token: string): string {
    return token.slice(1, -1);
};

const grammarRolesOf = function grammarRolesOf(folder: Readonly<Record<string, readonly string[]>>): GrammarRoles {
    const rolesAtDepth: string[][] = [];
    for (const key of DEPTH_KEYS) {
        const tokens = folder[key];
        if (tokens === undefined) {
            break;
        }
        rolesAtDepth.push(tokens.map(roleOf));
    }
    const roleOrder = [...new Set(rolesAtDepth.flat())];
    return { roleOrder, rolesAtDepth, terminalRole: roleOrder.at(-1) ?? "" };
};

export const createVocabulary = function createVocabulary(source: TaxonomySource): Vocabulary {
    const byTag = new Map<string, Concern>(
        source.concerns.flatMap((concern) =>
            concern.collection === undefined
                ? [[concern.tag, concern] as const]
                : [[concern.tag, concern] as const, [concern.collection, concern] as const],
        ),
    );
    const subjects = new Set<string>(source.subjects);
    return {
        boundaryDocuments: new Set<string>(source.boundaryDocuments),
        byFolder: new Map<string, Concern>(source.concerns.map((concern) => [concern.folder, concern])),
        byTag,
        case: source.grammar.case,
        compoundMarkers: source.grammar.compoundMarkers,
        dialects: source.grammar.dialects ?? [],
        excludedTrees: source.excluded?.trees ?? [],
        fileShapes: source.grammar.file,
        fixtureMarkers: source.grammar.fixtureMarkers ?? [],
        generatedFolder: source.grammar.generatedFolder ?? null,
        ignoredNames: source.ignored.foldersFiles,
        legalSubjects: new Set<string>([...subjects, ...byTag.keys()]),
        markerFolders: new Map<string, string>(Object.entries(source.grammar.markerFolders ?? {})),
        maxDepth: source.grammar.maxDepthFromRoot,
        roles: grammarRolesOf(source.grammar.folder),
        separator: source.grammar.separator,
        splitters: new Map((source.grammar.splitters ?? []).map((splitter) => [splitter.name, splitter])),
        subjects,
        testMarkers: source.grammar.testMarkers ?? [],
        variants: new Set<string>(source.variants),
    };
};
