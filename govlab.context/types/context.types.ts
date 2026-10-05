import type { AlgoGrammar, ConcernJoinRow } from "#types/algorithm.types";
import type { ArchRelations, KindDefinition } from "#types/architecture.types";
import type { CheckGaps, CheckedRecord, DeclaredCheck } from "#types/check.types";
import type { CrossFaceIssues, ResolutionIssues } from "#types/validation.types";
import type { Layer, LayerEdge, LayerJoin, TensionResolution } from "#types/layer.types";
import type { Lexicon } from "#types/lexicon.types";
import type { Logger } from "#types/ontology.types";
import type { PagGrammar } from "#types/grammar.types";
import type { ReasonOntology } from "#types/reason.types";

export interface GovlabContextOptions {
    checks?: readonly DeclaredCheck[] | undefined;
    logger?: Logger | undefined;
    canonicalizeId?: ((term: string) => string) | undefined;
}

export interface Faces {
    arch: ArchRelations;
    algo: AlgoGrammar;
    lex: Lexicon;
    pag: PagGrammar;
    reason: ReasonOntology;
    layerJoin: LayerJoin;
}

export interface GovlabContext {
    arch: ArchRelations;
    algo: AlgoGrammar;
    pag: PagGrammar;
    lex: Lexicon;
    reason: ReasonOntology;
    slugify: (name: string) => string;
    checkGaps: () => CheckGaps;
    checkedRecords: () => CheckedRecord[];
    kindTaxonomy: () => readonly KindDefinition[];
    joinConcerns: () => ConcernJoinRow[];
    crossValidate: () => CrossFaceIssues;
    validateResolution: () => ResolutionIssues;
    layers: () => Layer[];
    topology: () => LayerEdge[];
    layerOf: (idOrName: string) => string | null;
    resolutions: () => TensionResolution[];
    resolveTension: (a: string, b: string) => TensionResolution | null;
    resolveRef: (ref: string) => boolean;
}
