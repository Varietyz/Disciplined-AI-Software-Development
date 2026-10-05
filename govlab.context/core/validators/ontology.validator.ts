import type { CheckGaps, DeclaredCheck } from "#types/check.types";
import type { CrossFaceIssues, EmptyRequiredField, ResolutionIssues } from "#types/validation.types";
import { REF_COLLECTIONS, collectionRefResolver } from "#core/resolvers/reference.resolver";
import { aliasDefectsOf, aliasHoldersOf } from "#core/validators/alias.validator";
import {
    ambiguousReasonRefsOf,
    ungroundedGatesOf,
    unresolvedGrammarGroundsOf,
} from "#core/validators/algorithm.reference.validator";
import { buildKindLookup, lexKindIssues, relationKindViolationsOf } from "#core/validators/kind.validator";
import {
    crossFaceCollisions,
    invalidSeveritiesOf,
    unreachableAntiPatternsOf,
    unresolvedExpressionsOf,
} from "#core/validators/architecture.validator";
import { deadSeedsOf, tensionIssuesOf } from "#core/validators/tension.validator";
import {
    doctypeModelAxisOf,
    ungroundedPagConstructsOf,
    unresolvedPagGroundsOf,
} from "#core/validators/grammar.reference.validator";
import {
    idShapedEdgeLabelsOf,
    reasonDefectLines,
    unresolvedLensDetectorsOf,
    unresolvedReasonEdgesOf,
    unresolvedShapeInstancesOf,
} from "#core/validators/reason.reference.validator";
import { invalidRecordDistinctsOf, undeclaredAdjacentPairsOf } from "#core/validators/record.validator";
import { repairDefectsOf, repairKindLookup } from "#core/validators/repair.validator";
import { unresolvedConceptRefsOf, variantIdsOf } from "#core/validators/concept.validator";
import { ALGO_SCHEMA } from "#configuration/schemas/algorithm.schema";
import { ARCH_SCHEMA } from "#configuration/schemas/architecture.schema";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import type { Faces } from "#types/context.types";
import type { KindSchema } from "#types/field.types";
import { LEX_SCHEMA } from "#configuration/schemas/lexicon.schema";
import { ONTOLOGY_FACES } from "#core/registries/context.registry";
import type { UnreadKey } from "#types/record.types";
import { asciiArrowsOf } from "#core/validators/syntax.validator";
import { checkGapsOf } from "#core/analyzers/check.analyzer";
import { crossValidateFaces } from "#core/validators/vocabulary.validator";
import { emptyFields } from "#core/validators/field.validator";
import { exemplarGapsOf } from "#core/validators/exemplar.validator";
import { integrityIssuesOf } from "#core/validators/algorithm.validator";
import { reasonNativeIssuesOf } from "#core/validators/algorithm.reason.validator";
import { tagExampleDefectsOf } from "#core/validators/lexicon.validator";

type CheckParts =
    | "checkDeclarationDefects"
    | "secondCheckHomes"
    | "uncheckedRecords"
    | "uncoveredCollections"
    | "unresolvedCheckRefs";
type CrossParts = "danglingPrincipleRefs" | "misspelledForces" | "unknownForces";
type ResolutionParts = Omit<ResolutionIssues, CheckParts | CrossParts | "integrity" | "reasonNative" | "total">;

const emptyFieldsOf = function emptyFieldsOf(
    collection: string,
    records: readonly { id: string }[],
    schema: KindSchema,
): EmptyRequiredField[] {
    return records.flatMap((record) =>
        emptyFields(schema, record).map((field) => ({ collection, field, id: record.id })),
    );
};

const unknownRecordKeysOf = function unknownRecordKeysOf(faces: Faces): UnreadKey[] {
    return [
        ...faces.arch.unreadKeys(),
        ...faces.algo.unreadKeys(),
        ...faces.lex.unreadKeys(),
        ...faces.pag.unreadKeys(),
        ...faces.reason.unreadKeys(),
        ...faces.layerJoin.unreadKeys(),
    ];
};

const variantCollections = function variantCollections(faces: Faces): Map<string, readonly string[]> {
    return new Map<string, readonly string[]>([
        [COLLECTIONS.algorithms, faces.algo.all().map((contract) => contract.id)],
        [COLLECTIONS.architecture, faces.arch.ids()],
        ...[...faces.reason.kindMembers()].map(([kind, ids]): [string, string[]] => [
            `${COLLECTIONS.reasoning}:${kind}`,
            [...ids],
        ]),
    ]);
};

const partsOf = function partsOf(faces: Faces): ResolutionParts {
    const archIssues = faces.arch.validateOntology();
    const algoIssues = faces.algo.validateOntology();
    const lexKind = lexKindIssues(faces.lex, faces.arch);
    return {
        ...faces.pag.validateOntology(),
        aliasDefects: aliasDefectsOf(aliasHoldersOf(faces)),
        ambiguousReasonRefs: ambiguousReasonRefsOf(faces),
        asciiArrows: asciiArrowsOf(faces),
        crossFaceIdCollisions: crossFaceCollisions(faces.arch, faces.lex),
        deadResolutionSeeds: deadSeedsOf(faces.layerJoin),
        doctypeModelAxis: doctypeModelAxisOf(faces),
        duplicateIds: [...archIssues.duplicateIds, ...algoIssues.duplicateIds],
        emptyRequiredFields: [
            ...emptyFieldsOf(COLLECTIONS.architecture, faces.arch.all(), ARCH_SCHEMA),
            ...emptyFieldsOf(COLLECTIONS.lexicon, faces.lex.all(), LEX_SCHEMA),
            ...emptyFieldsOf(COLLECTIONS.algorithms, faces.algo.all(), ALGO_SCHEMA),
        ],
        exemplarGaps: exemplarGapsOf(faces.algo),
        idShapedEdgeLabels: idShapedEdgeLabelsOf(faces),
        invalidRecordDistincts: invalidRecordDistinctsOf(faces),
        invalidSeverities: invalidSeveritiesOf(faces.arch),
        kindConsistencyViolations: lexKind.kindConsistencyViolations,
        lexDefects: lexKind.lexDefects,
        reasonOntologyDefects: reasonDefectLines(faces.reason.validateReasonOntology()),
        relationKindViolations: relationKindViolationsOf(faces.arch, buildKindLookup(faces)),
        repairDefects: repairDefectsOf(faces.arch.all(), repairKindLookup(faces)),
        tagExampleDefects: tagExampleDefectsOf(faces.lex),
        undeclaredAdjacentPairs: undeclaredAdjacentPairsOf(faces),
        ungroundedGates: ungroundedGatesOf(faces),
        ungroundedPagConstructs: ungroundedPagConstructsOf(faces),
        unknownRecordKeys: unknownRecordKeysOf(faces),
        unreachableAntiPatterns: unreachableAntiPatternsOf(faces.arch),
        unresolvedAlgoComposes: algoIssues.danglingComposes,
        unresolvedArchEdges: archIssues.danglingEdges.filter((edge) => faces.lex.resolve(edge.target) === null),
        unresolvedConceptRefs: unresolvedConceptRefsOf(collectionRefResolver(faces)),
        unresolvedExpressions: unresolvedExpressionsOf(faces),
        unresolvedGrammarGrounds: unresolvedGrammarGroundsOf(faces),
        unresolvedLensDetectors: unresolvedLensDetectorsOf(faces),
        unresolvedPagGrounds: unresolvedPagGroundsOf(faces),
        unresolvedReasonEdges: unresolvedReasonEdgesOf(faces),
        unresolvedShapeInstances: unresolvedShapeInstancesOf(faces),
        unresolvedTensions: tensionIssuesOf(faces),
        variantIds: variantIdsOf(variantCollections(faces)),
    };
};

export const checkGapsFor = function checkGapsFor(faces: Faces, checks: readonly DeclaredCheck[] = []): CheckGaps {
    return checkGapsOf(
        faces,
        { collections: REF_COLLECTIONS, resolve: collectionRefResolver(faces) },
        ONTOLOGY_FACES.map((face) => face.name),
        checks,
    );
};

const lengthSum = function lengthSum(lists: readonly (readonly unknown[])[]): number {
    return lists.reduce((sum, list) => sum + list.length, 0);
};

export const runValidation = function runValidation(
    faces: Faces,
    checks: readonly DeclaredCheck[] = [],
): ResolutionIssues {
    const parts = partsOf(faces);
    const cross: CrossFaceIssues = crossValidateFaces(faces);
    const reasonNative = reasonNativeIssuesOf(faces);
    const integrity = integrityIssuesOf(faces);
    const gaps = checkGapsFor(faces, checks);
    const checkParts = {
        checkDeclarationDefects: gaps.checkDeclarationDefects,
        secondCheckHomes: gaps.secondCheckHomes,
        uncheckedRecords: gaps.uncheckedRecords,
        uncoveredCollections: gaps.uncoveredCollections,
        unresolvedCheckRefs: gaps.unresolvedCheckRefs,
    };
    return {
        ...parts,
        ...checkParts,
        danglingPrincipleRefs: cross.danglingPrincipleRefs,
        integrity,
        misspelledForces: cross.misspelledForces,
        reasonNative,
        total:
            lengthSum(Object.values(parts)) +
            lengthSum(Object.values(cross)) +
            reasonNative.subtotal +
            integrity.subtotal +
            lengthSum(Object.values(checkParts)),
        unknownForces: cross.unknownForces,
    };
};
