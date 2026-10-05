import type { GraphChunk, GraphEdge, GraphNode, RelationPair } from "@banes-lab/web/types/graph.types.js";
import type { Linker, Population } from "#types/catalog.types";
import type { AnatomyFolder } from "@banes-lab/web/types/anatomy.types.js";
import type { BuiltOntology } from "#types/ontology.types";
import type { Discovery } from "#types/site.types";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { EvidenceNode } from "@banes-lab/web/types/evidence.types.js";
import type { SearchAsset } from "@banes-lab/web/types/search.types.js";
import type { SectionPlan } from "#types/section.types";
import type { SourceTree } from "#types/source.types";
import type { Term } from "@govlab/context";
import type { WebModules } from "#types/loader.types";

export interface SiteScope {
    readonly linker: Linker;
    readonly plans: readonly SectionPlan[];
    readonly web: WebModules;
}

export interface ChunkRules {
    readonly contains: string;
    readonly keptRelations: ReadonlySet<string>;
    readonly keyOf: (ref: string) => string;
    readonly pairs: readonly RelationPair[];
    readonly rollsUp: ReadonlySet<string>;
    readonly skipsSource: (ref: string) => boolean;
}

export interface Graph {
    readonly edges: readonly GraphEdge[];
    readonly nodes: readonly GraphNode[];
}

export interface Undeclared {
    readonly face: string;
    readonly kind: string;
    readonly relation: string;
}

export interface SourceIds {
    readonly fileId: (path: string) => string;
    readonly folderHref: (path: string) => string;
    readonly folderId: (path: string) => string;
    readonly localPath: (path: string) => string;
    readonly nodeHref: (file: string, line: number | null) => string;
}

export interface Vocabulary {
    readonly calls: string;
    readonly contains: string;
    readonly pairs: readonly RelationPair[];
}

export interface FieldRule {
    readonly flip: boolean;
    readonly relation: string | null;
}

export interface FieldUse extends Undeclared {
    readonly flip: boolean;
    readonly stored: string | null;
}

export interface UnresolvedTarget {
    readonly from: string;
    readonly label: string;
    readonly relation: string;
}

export interface OntologyGraph extends Graph {
    readonly ambiguous: readonly Undeclared[];
    readonly fields: readonly FieldUse[];
    readonly populations: readonly Population[];
    readonly undeclared: readonly Undeclared[];
    readonly unresolved: readonly UnresolvedTarget[];
}

export interface Merged extends Graph {
    readonly duplicates: readonly (readonly [GraphNode, GraphNode])[];
}

export interface EdgeIndex {
    readonly incoming: (ref: string, relation: string) => readonly EdgeRef[];
    readonly outgoing: (ref: string, relation: string) => readonly EdgeRef[];
}

export interface TooltipGap {
    readonly from: string;
    readonly relation: string;
    readonly to: string;
}

export interface GraphReport {
    readonly ambiguous: readonly Undeclared[];
    readonly dangling: readonly GraphEdge[];
    readonly duplicates: readonly { readonly dropped: GraphNode; readonly kept: GraphNode }[];
    readonly fields: readonly FieldUse[];
    readonly graph: Graph;
    readonly populations: readonly Population[];
    readonly tooltipGaps: readonly TooltipGap[];
    readonly uncovered: readonly string[];
    readonly undeclared: readonly Undeclared[];
    readonly unresolved: readonly UnresolvedTarget[];
}

export interface GraphLines {
    readonly chunks: number;
    readonly records: number;
    readonly report: GraphReport;
    readonly routes: number;
    readonly search: SearchAsset;
    readonly stops: number;
}

export interface GraphFiles {
    readonly graph: string;
    readonly learning: string;
    readonly report: string;
    readonly search: string;
    readonly tabs: string;
}

export interface RouteEdges {
    readonly edges: readonly GraphEdge[];
    readonly unresolved: readonly UnresolvedTarget[];
}

export interface GraphContext {
    readonly built: BuiltOntology;
    readonly codes: SiteCodes;
    readonly discovery: Discovery;
    readonly evidenceSubjects: readonly string[];
    readonly evidenceTarget: (node: EvidenceNode) => string | null;
    readonly ids: SourceIds;
    readonly numbers: ReadonlyMap<string, string>;
    readonly ontology: OntologyGraph;
    readonly route: RouteEdges;
    readonly scope: SiteScope;
    readonly trees: readonly SourceTree[];
    readonly vocabulary: Vocabulary;
}

export interface ConcernSource {
    readonly built: { readonly context: { readonly lex: { readonly all: () => readonly Term[] } } };
    readonly ids: Pick<SourceIds, "fileId">;
    readonly ontology: { readonly nodes: readonly Pick<GraphNode, "ref">[] };
    readonly trees: readonly { readonly snapshot: { readonly tree: AnatomyFolder } }[];
}

export interface ConcernScope {
    readonly fileRef: (path: string) => string;
    readonly records: ReadonlySet<string>;
    readonly roots: readonly AnatomyFolder[];
    readonly terms: readonly Term[];
}

export interface GraphProducer {
    readonly name: string;
    readonly produce: (context: GraphContext) => Graph;
}

export interface GraphBuild {
    readonly chunks: ReadonlyMap<string, GraphChunk>;
    readonly report: GraphReport;
}

export interface SiteCodes {
    readonly pages: ReadonlyMap<string, string>;
    readonly tabs: ReadonlyMap<string, string>;
}
