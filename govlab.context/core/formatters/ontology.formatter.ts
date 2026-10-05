import {
    COVERAGE_HEADING,
    NATIVE_HEADING,
    NATIVE_ROWS,
    REPORT_HEADING,
    SUMMARY_ROWS,
    archEdgesRow,
    coverageCell,
    coverageRow,
    lexiconTermsRow,
    nativeBacklogRow,
    nativeRow,
    nativeSubtotalRow,
    pagBnfRow,
    pagRecognitionRow,
    pagTemplateRow,
    summaryRow,
    symbolStalenessRow,
    totalRow,
    unreachedRow,
} from "#configuration/strings/ontology.report.strings";
import type { CheckGaps } from "#types/check.types";
import type { ResolutionIssues } from "#types/validation.types";

type SummaryKey = keyof typeof SUMMARY_ROWS;

const HEAD_KEYS: readonly SummaryKey[] = [
    "duplicateIds",
    "crossFaceIdCollisions",
    "lexDefects",
    "kindConsistencyViolations",
    "tagExampleDefects",
];

const TAIL_KEYS: readonly SummaryKey[] = [
    "relationKindViolations",
    "unresolvedAlgoComposes",
    "danglingPrincipleRefs",
    "unknownForces",
    "misspelledForces",
    "exemplarGaps",
    "unreachableAntiPatterns",
    "unresolvedTensions",
    "deadResolutionSeeds",
    "unresolvedReasonEdges",
    "unresolvedGrammarGrounds",
    "unresolvedLensDetectors",
    "ungroundedPagConstructs",
    "unresolvedPagGrounds",
    "doctypeModelAxis",
    "ungroundedGates",
    "reasonOntologyDefects",
    "unknownRecordKeys",
    "emptyRequiredFields",
    "invalidSeverities",
    "asciiArrows",
    "unresolvedExpressions",
    "undeclaredAdjacentPairs",
    "invalidRecordDistincts",
    "aliasDefects",
    "repairDefects",
    "unresolvedShapeInstances",
    "ambiguousReasonRefs",
    "idShapedEdgeLabels",
    "uncheckedRecords",
    "unresolvedCheckRefs",
    "checkDeclarationDefects",
    "secondCheckHomes",
    "uncoveredCollections",
];

const rowsOf = function rowsOf(issues: ResolutionIssues, keys: readonly SummaryKey[]): string[] {
    return keys.map((key) => {
        const [label, note] = SUMMARY_ROWS[key];
        return summaryRow(label, issues[key].length, note);
    });
};

export const summaryLines = function summaryLines(issues: ResolutionIssues, terms: number, targets: number): string[] {
    return [
        REPORT_HEADING,
        lexiconTermsRow(terms),
        ...rowsOf(issues, HEAD_KEYS),
        pagTemplateRow([
            issues.duplicateKeywordIds.length,
            issues.danglingTemplateSlots.length,
            issues.docTypesWithoutVerb.length,
            issues.unknownTemplateTypes.length,
        ]),
        pagRecognitionRow(issues.unrecognizedDocumentTypes.length, issues.unrecognizedDocumentVerbs.length),
        pagBnfRow(issues.danglingNonterminals.length, issues.unusedTerminals.length),
        archEdgesRow(issues.unresolvedArchEdges.length, targets),
        ...rowsOf(issues, TAIL_KEYS),
    ];
};

export const coverageLines = function coverageLines(gaps: CheckGaps): string[] {
    return [
        COVERAGE_HEADING,
        ...gaps.collections.map((coverage) =>
            coverageRow(
                coverage.collection,
                coverage.records,
                coverage.questions.map((q) => coverageCell(q.question, q.answered, q.declaredAbsent)).join(", "),
            ),
        ),
        unreachedRow(gaps.unreachedByPropagation.length),
    ];
};

const row = function row(entry: readonly [string, string], count: number): string {
    return nativeRow(entry[0], count, entry[1]);
};

export const nativeLines = function nativeLines(issues: ResolutionIssues): string[] {
    const { integrity, reasonNative } = issues;
    const coherence =
        reasonNative.invalidStages.length +
        reasonNative.invalidAxes.length +
        reasonNative.invalidMathTypes.length +
        reasonNative.stageAxisMismatches.length +
        reasonNative.yieldsShapeMismatches.length +
        reasonNative.derivationMapDefects.length;
    return [
        NATIVE_HEADING,
        nativeBacklogRow(reasonNative.untypedRecords.length, reasonNative.unstagedProcessRecords.length),
        row(NATIVE_ROWS.coherence, coherence),
        row(NATIVE_ROWS.duplicateLoops, reasonNative.duplicateLoopGroundings.length),
        row(NATIVE_ROWS.metaLoops, reasonNative.metaLoopGroundings.length),
        row(NATIVE_ROWS.metaKernels, reasonNative.metaKernelNaming.length),
        row(NATIVE_ROWS.divergent, integrity.intraGrammarDivergentSymbols.length),
        symbolStalenessRow(integrity.symbolIndexStale, integrity.indexedSymbolCount, integrity.liveSymbolCount),
        nativeSubtotalRow(reasonNative.subtotal + integrity.subtotal),
        row(NATIVE_ROWS.crossCatalog, integrity.crossCatalogRedundancy.length),
        row(NATIVE_ROWS.invalidDistincts, integrity.invalidDistinctDeclarations.length),
        totalRow(issues.total),
    ];
};
