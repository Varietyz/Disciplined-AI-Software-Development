export { createGovlabPatterns } from "#core/factories/pattern.factory";
export { definePatternFace, foldFaces } from "#core/registries/pattern.registry";
export { NOOP_LOGGER } from "#core/reporters/pattern.reporter";
export type {
    FaceContext,
    GovlabPatterns,
    GovlabPatternsOptions,
    Logger,
    PatternFaceDefinition,
} from "#types/pattern.types";

export {
    ANALYSIS_AXIS,
    ONTOLOGY_AXIS,
    REASONING_AXIS,
    REPRESENTATION_AXIS,
} from "#configuration/generated/axis.generated";
export { isAnalysisTag, isOntologyTag, isReasoningRung, isRepresentationTag } from "#core/predicates/axis.predicate";
export { reasoningRank } from "#core/resolvers/axis.resolver";
export type {
    AnalysisTag,
    Coordinate,
    CoordinateInput,
    OntologyTag,
    ReasoningRung,
    RepresentationTag,
} from "#types/axis.types";
export { CoordinateError, coordinate } from "#core/factories/axis.factory";
export { MATH_TYPES } from "#configuration/constants/math.constants";
export { isMathType } from "#core/predicates/math.predicate";
export { mathTypeOf } from "#core/resolvers/math.resolver";

export { AnalysisGraph } from "#core/models/graph.model";
export { analysisNode, findingNode, sourceNode } from "#core/factories/node.factory";
export { GraphError } from "#core/validators/graph.validator";
export { SOURCE_ID } from "#configuration/constants/graph.constants";
export type { Node, NodeKind } from "#types/graph.types";

export { DataLoadError, kindOf } from "#core/classifiers/schema.classifier";
export { detectSchema } from "#core/analyzers/schema.analyzer";
export { isCoordinatePair } from "#core/predicates/schema.predicate";
export { schemaFromDict } from "#core/parsers/schema.parser";
export { validateMapping, validateRecord } from "#core/validators/schema.validator";
export type { FieldSchema, Kind, Primitive } from "#types/schema.types";
export { numberTokenIsFloat, scanFloatFields } from "#core/parsers/field.parser";
export { inferMapping, unrepresentable } from "#core/resolvers/representation.resolver";
export { applicableAnalyses, registeredRepresentations } from "#core/selectors/representation.selector";
export { registerRepresentation } from "#core/registries/representation.registry";
export { loadPlugins } from "#core/loaders/representation.loader";
export type { RepresentationDefinition, RepresentationRuntime } from "#types/representation.types";

export { createRng } from "#core/factories/seed.factory";
export { gaussian } from "#core/converters/math.converter";
export { weightedChoice, weightedSample } from "#core/selectors/counter.selector";
export type { Rng } from "#types/seed.types";
export { createCompressibility } from "#core/analyzers/information.analyzer";
export type { Compressibility } from "#types/information.types";
export {
    autocorrelationSignificance,
    chiSquareSf,
    erf,
    erfc,
    normalSignificance,
    transitionIndependence,
    uniformity,
} from "#core/analyzers/baseline.analyzer";
export type { Significance, Transition, Uniformity } from "#types/baseline.types";

export { DistributionAccumulator } from "#core/aggregators/representation.distribution.aggregator";
export { VectorAccumulator } from "#core/aggregators/representation.vector.aggregator";
export { SequenceAccumulator } from "#core/aggregators/representation.sequence.aggregator";
export { GridAccumulator } from "#core/aggregators/representation.grid.aggregator";
export { TreeAccumulator } from "#core/aggregators/representation.tree.aggregator";
export { GraphAccumulator } from "#core/aggregators/representation.graph.aggregator";
export type {
    Composition,
    DistributionSummary,
    GraphSummary,
    GridSummary,
    OrderedStats,
    SequenceSummary,
    Temporal,
    TreeSummary,
    VectorSummary,
} from "#types/representation.types";

export { makeFinding, reasonOf } from "#core/factories/finding.factory";
export type { Finding, FindingInput, FindingSignificance, Narrative, Prediction } from "#types/finding.types";
export { distributionFindings } from "#core/converters/finding.distribution.converter";
export { vectorFindings } from "#core/converters/finding.vector.converter";
export { sequenceFindings } from "#core/converters/finding.sequence.converter";
export { gridFindings } from "#core/converters/finding.grid.converter";
export { treeFindings } from "#core/converters/finding.tree.converter";
export { graphFindings } from "#core/converters/finding.graph.converter";

export { analyze, report } from "#core/pipelines/record.pipeline";
export { synthesize } from "#core/factories/record.factory";
export { streamReports, windowedReports } from "#core/pipelines/snapshot.pipeline";
export { discoverSources, loadRecords, streamJsonlFile } from "#core/loaders/record.loader";
export { graphToDict } from "#core/converters/report.converter";
export type {
    AnalyzeOptions,
    AnalyzeReport,
    AnalyzeResult,
    Coverage,
    LoadedData,
    SynthesizeOptions,
    WindowSnapshot,
} from "#types/record.types";

export { renderHexGrid } from "#core/renderers/walk.renderer";
export { packCells, unpackCells, walkCells } from "#core/converters/walk.converter";
export { CELL_COLUMNS } from "#configuration/constants/walk.constants";
export { STATE_LEGEND, walkSubtitle } from "#configuration/strings/walk.strings";
export { assertHardened, hardenIssues } from "#core/validators/markup.validator";
export type { HexGridOptions, PackedCells, PackedRow, WalkCell, WalkNode } from "#types/walk.types";

export { buildContext, emptyContext } from "#core/factories/context.factory";
export { buildModuleReport } from "#core/coordinators/package.coordinator";
export { discoverModules } from "#core/loaders/package.loader";
export type { FileEntry, ModuleReportBuild, ModuleScope, RepoContext } from "#types/package.types";
export type { DefinitionRecord, ModuleReport, ReportMetrics, ReportPage } from "#types/report.types";

export { availableLanguages, detectLanguage, parseCode } from "@govlab/code-parse";
export { codeInsight } from "#core/analyzers/code.analyzer";
export { crossModuleFanIn } from "#core/counters/dependency.counter";
export { ingestCode, ingestFile, ingestImports, ingestSymbols } from "#core/parsers/code.parser";
export { syntaxDistribution } from "#core/analyzers/syntax.analyzer";
export type { CodeFinding, CodeInsight, CodeSymbol, Distribution, ImportBinding, IngestFile } from "#types/code.types";

export { createInterventionBridge, proposerFromRules } from "#core/factories/operation.factory";
export type { BridgeConfig, Intervention, InterventionBridge, InterventionResult } from "#types/operation.types";
