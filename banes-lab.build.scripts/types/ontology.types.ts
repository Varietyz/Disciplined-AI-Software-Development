import type {
    ContractDomainView,
    LayerEdgeView,
    OntologySnapshot,
    PrincipleCategoryView,
    TensionView,
    TermCategoryView,
} from "@banes-lab/web/types/ontology.types.js";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { GovlabContext } from "@govlab/context";
import type { ReferenceIndex } from "@banes-lab/web/types/reference.types.js";
import type { TestSurfaceView } from "@banes-lab/web/types/reason.types.js";

export type RefIndex = ReadonlyMap<string, readonly EdgeRef[]>;

export interface ReasonSources {
    readonly context: GovlabContext;
    readonly index: ReverseIndex;
    readonly resolve: Resolver;
}

export type ReverseIndex = ReadonlyMap<string, RefIndex>;

export interface Resolver {
    readonly algo: (label: string) => EdgeRef;
    readonly arch: (label: string) => EdgeRef;
    readonly archCategory: (label: string) => EdgeRef;
    readonly archId: (id: string) => EdgeRef;
    readonly labels: (phrases: readonly string[]) => readonly EdgeRef[];
    readonly edgeSource: (id: string) => EdgeRef;
    readonly force: (force: string, known: ReadonlySet<string>) => EdgeRef;
    readonly kind: (kind: string) => EdgeRef;
    readonly layer: (id: string) => EdgeRef;
    readonly lexCategory: (slug: string) => EdgeRef;
    readonly pag: (local: string) => EdgeRef;
    readonly reason: (id: string) => EdgeRef;
    readonly reasonAs: (kind: string, id: string) => EdgeRef;
    readonly vocabulary: (id: string, value: string) => EdgeRef;
    readonly stage: (id: string) => EdgeRef;
    readonly target: (raw: string) => EdgeRef;
    readonly tension: (a: EdgeRef, b: EdgeRef) => EdgeRef;
}

export type ReferenceFaces = ReadonlyMap<string, ReferenceIndex>;

export interface OntologySources {
    readonly context: GovlabContext;
    readonly forces: ReadonlySet<string>;
    readonly index: ReverseIndex;
    readonly resolve: Resolver;
}

export interface OntologyFiles {
    readonly ontology: string;
    readonly reference: string;
    readonly vocabulary: string;
}

export interface BuiltOntology {
    readonly collections: ReferenceFaces;
    readonly context: GovlabContext;
    readonly snapshot: OntologySnapshot;
}

export interface VocabularyUsers {
    readonly contracts: readonly ContractDomainView[];
    readonly principles: readonly PrincipleCategoryView[];
    readonly surfaces: readonly TestSurfaceView[];
    readonly tensions: readonly TensionView[];
    readonly terms: readonly TermCategoryView[];
    readonly topology: readonly LayerEdgeView[];
}

export interface OntologyBuild {
    readonly ontology: BuiltOntology;
    readonly phrases: number;
    readonly references: number;
}
