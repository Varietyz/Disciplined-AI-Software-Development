export interface Concern {
    folder: string;
    tag: string;
    layer: string;
    collection?: string;
}

export interface ParsedName {
    subject: string;
    variant: string | null;
    concern: string;
    ext: string;
}

export interface ExemptName {
    exempt: true;
    marker: string;
}

export interface ParseFailure {
    reason: string;
    word: string;
}

export type ParseResult = ExemptName | ParsedName | ParseFailure;

export type ContainerKind = "container" | "special";

export type LetterCase = "lower" | "upper";

export interface Splitter {
    readonly name: string;
    readonly joiner: string | null;
    readonly letters: LetterCase;
}

export interface Dialect {
    readonly splitter: string;
    readonly extensions: readonly string[];
}

export interface Placement {
    root: string;
    container: string;
    kind: ContainerKind;
    firstBelow: string;
    depth: number;
}

export interface PlacementFinding {
    messageId: string;
    data: Record<string, string>;
}

export interface TaxonomyFinding extends PlacementFinding {
    path: string;
}

export interface TaxonomyReport {
    readonly assessed: number;
    readonly findings: readonly TaxonomyFinding[];
}

export interface GeneratedFolderForm {
    readonly marker: string;
    readonly prefix: string;
}

export interface ExcludedTrees {
    readonly trees: readonly string[];
}

export interface TaxonomyView {
    readonly byFolder: ReadonlyMap<string, Concern>;
    readonly byTag: ReadonlyMap<string, Concern>;
    readonly compoundMarkers: readonly string[];
    readonly containers: ReadonlyMap<string, ReadonlySet<string>>;
    readonly declaredContainers: Readonly<Record<string, readonly string[]>>;
    readonly declaredSpecial: Readonly<Record<string, readonly string[]>>;
    readonly dialects: readonly Dialect[];
    readonly generatedFolder: GeneratedFolderForm | null;
    readonly ignoredNames: readonly string[];
    readonly markerFolders: ReadonlyMap<string, string>;
    readonly maxDepth: number;
    readonly special: ReadonlyMap<string, ReadonlySet<string>>;
    readonly splitters: readonly Splitter[];
    readonly subjects: ReadonlySet<string>;
    readonly fixtureMarkers: readonly string[];
    readonly testMarkers: readonly string[];
}

export interface GrammarRoles {
    readonly rolesAtDepth: readonly (readonly string[])[];
    readonly roleOrder: readonly string[];
    readonly terminalRole: string;
}

export interface IgnoreDeclaration {
    readonly foldersFiles: readonly string[];
}

export type TaxonomySource = Readonly<Record<"Ignored", IgnoreDeclaration>> & TaxonomyShape;

export interface TaxonomyShape {
    readonly Excluded?: ExcludedTrees;
    readonly boundaryDocuments?: readonly string[];
    readonly concerns: readonly Concern[];
    readonly containers: Readonly<Record<string, readonly string[]>>;
    readonly foreignContainers?: Readonly<Record<string, readonly string[]>>;
    readonly grammar: {
        readonly case: string;
        readonly compoundMarkers: readonly string[];
        readonly dialects?: readonly Dialect[];
        readonly file: readonly string[];
        readonly folder: Readonly<Record<string, readonly string[]>>;
        readonly generatedFolder?: GeneratedFolderForm;
        readonly markerFolders?: Readonly<Record<string, string>>;
        readonly maxDepthFromRoot: number;
        readonly separator: string;
        readonly fixtureMarkers?: readonly string[];
        readonly splitters?: readonly Splitter[];
        readonly testMarkers?: readonly string[];
    };
    readonly specialContainers: Readonly<Record<string, readonly string[]>>;
    readonly subjects: readonly string[];
    readonly testMirrors?: Readonly<Record<string, string>>;
    readonly variants: readonly string[];
}

export interface Vocabulary {
    readonly boundaryDocuments: ReadonlySet<string>;
    readonly byFolder: ReadonlyMap<string, Concern>;
    readonly byTag: ReadonlyMap<string, Concern>;
    readonly case: string;
    readonly compoundMarkers: readonly string[];
    readonly dialects: readonly Dialect[];
    readonly excludedTrees: readonly string[];
    readonly fileShapes: readonly string[];
    readonly generatedFolder: GeneratedFolderForm | null;
    readonly ignoredNames: readonly string[];
    readonly legalSubjects: ReadonlySet<string>;
    readonly markerFolders: ReadonlyMap<string, string>;
    readonly maxDepth: number;
    readonly roles: GrammarRoles;
    readonly separator: string;
    readonly splitters: ReadonlyMap<string, Splitter>;
    readonly subjects: ReadonlySet<string>;
    readonly fixtureMarkers: readonly string[];
    readonly testMarkers: readonly string[];
    readonly variants: ReadonlySet<string>;
}

export interface Jurisdiction {
    readonly containers: ReadonlyMap<string, ReadonlySet<string>>;
    readonly foreign: ReadonlyMap<string, ReadonlySet<string>>;
    readonly host: Vocabulary;
    readonly mirrors: ReadonlyMap<string, string>;
    readonly roots: readonly string[];
    readonly special: ReadonlyMap<string, ReadonlySet<string>>;
    readonly vocabularies: ReadonlyMap<string, Vocabulary>;
}
