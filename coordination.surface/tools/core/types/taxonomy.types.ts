export type Role = "concern" | "container" | "subject";

export const PLACEMENT_CODES = [
    "undeclaredContainer",
    "nestedInSpecial",
    "looseFileAtRoot",
    "badShape",
    "roleOutOfOrder",
    "tooDeep",
    "dottedFolder",
    "parentNotConcern",
] as const;

export const NAMING_CODES = ["unparsable", "concernMismatch", "subjectEqualsConcern", "undeclaredSlot"] as const;

export type PlacementCode = (typeof PLACEMENT_CODES)[number];
export type NamingCode = (typeof NAMING_CODES)[number];

export interface ParsedName {
    readonly subject: string;
    readonly variant: string | null;
    readonly concern: string;
    readonly ext: string;
    readonly marker: string | null;
}

export interface CorpusRootData {
    readonly facetFields: readonly string[];
    readonly facetByValue: Readonly<Record<string, string>>;
    readonly variantByOrigin: Readonly<Record<string, string>>;
    readonly filedUnder: string;
}

export interface ArtifactRootData {
    readonly binding: string;
    readonly field: readonly string[];
    readonly subtrees: readonly string[];
}

export interface GovernedPath {
    readonly root: string;
    readonly segments: readonly string[];
}

export interface ForeignMarker {
    readonly evidence: string;
    readonly why: string;
}

export interface TaxonomyData {
    readonly containers: Readonly<Record<string, readonly string[]>>;
    readonly specialContainers: Readonly<Record<string, readonly string[]>>;
    readonly foreignContainers: Readonly<Record<string, readonly string[]>>;
    readonly concernFolders: readonly string[];
    readonly concernTags: readonly string[];
    readonly folderToTag: Readonly<Record<string, string>>;
    readonly folderToLayer: Readonly<Record<string, string>>;
    readonly subjects: readonly string[];
    readonly variants: readonly string[];
    readonly agentLetters: readonly string[];
    readonly compoundMarkers: readonly string[];
    readonly verificationMarkers: readonly string[];
    readonly ignored: readonly string[];
    readonly boundaryDocuments: readonly string[];
    readonly maxDepthFromRoot: number;
    readonly corpusRoots: Readonly<Record<string, CorpusRootData>>;
    readonly artifactRoots: Readonly<Record<string, ArtifactRootData>>;
    readonly foreignGrammar: {
        readonly groupingDelimiters: readonly (readonly string[])[];
        readonly ownershipManifests: readonly string[];
    };
}
