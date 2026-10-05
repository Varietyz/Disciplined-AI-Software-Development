import {
    BLOCK_HEADINGS,
    aliasLine,
    ambiguousLine,
    blockHeading,
    checkRefLine,
    collisionLine,
    deadSeedLine,
    declarationLine,
    distinctLine,
    edgeLabelLine,
    expressionLine,
    failedItem,
    fieldLine,
    groundLine,
    kindConflictLine,
    lensLine,
    lexDefectLine,
    misspelledLine,
    moreItems,
    pairLine,
    reasonEdgeLine,
    reasonedLine,
    relationLine,
    repairLine,
    shapeInstanceLine,
    tensionLine,
    uncheckedLine,
    ungroundedGateLine,
    unknownKeyLine,
    unreachableLine,
} from "#configuration/strings/validation.report.strings";
import type { ResolutionIssues } from "#types/validation.types";
import { SAMPLE } from "#configuration/constants/invocation.constants";

type Heading = keyof typeof BLOCK_HEADINGS;

const blockOf = function blockOf<T>(items: readonly T[], heading: Heading, format: (item: T) => string): string[] {
    return items.length === 0
        ? []
        : [blockHeading(BLOCK_HEADINGS[heading]), ...items.map((item) => failedItem(format(item)))];
};

const sampledBlockOf = function sampledBlockOf<T>(
    items: readonly T[],
    limit: number,
    heading: Heading,
    format: (item: T) => string,
): string[] {
    const lines = blockOf(items.slice(0, limit), heading, format);
    return items.length > limit ? [...lines, moreItems(items.length - limit)] : lines;
};

export const defectLines = function defectLines(issues: ResolutionIssues): string[] {
    return [
        ...issues.lexDefects.map((d) => failedItem(lexDefectLine(d.id, d.reason))),
        ...issues.crossFaceIdCollisions.map((c) => failedItem(collisionLine(c))),
        ...issues.kindConsistencyViolations.map((v) =>
            failedItem(kindConflictLine(v.id, v.declaredKind, v.opening, v.signalsKind)),
        ),
    ];
};

export const worklistLines = function worklistLines(issues: ResolutionIssues, list: boolean): string[] {
    const limit = list ? Number.POSITIVE_INFINITY : SAMPLE;
    return [
        ...sampledBlockOf(issues.unreachableAntiPatterns, limit, "unreachableAntiPatterns", unreachableLine),
        ...sampledBlockOf(issues.exemplarGaps, limit, "exemplarGaps", (g) => reasonedLine(g.id, g.reason)),
        ...sampledBlockOf(issues.unresolvedTensions, limit, "unresolvedTensions", (t) =>
            tensionLine(t.from, t.target, t.reason),
        ),
        ...blockOf(issues.tagExampleDefects.slice(0, limit), "tagExampleDefects", (d) => reasonedLine(d.id, d.reason)),
        ...blockOf(issues.misspelledForces, "misspelledForces", (f) => misspelledLine(f.record, f.token, f.canonical)),
        ...blockOf(issues.deadResolutionSeeds, "deadResolutionSeeds", (t) => deadSeedLine(t.from, t.target, t.reason)),
        ...blockOf(issues.ungroundedGates, "ungroundedGates", ungroundedGateLine),
        ...blockOf(issues.reasonOntologyDefects, "reasonOntologyDefects", (d) => d),
        ...blockOf(issues.invalidSeverities, "invalidSeverities", (s) => reasonedLine(s.id, s.reason)),
        ...blockOf(issues.asciiArrows.slice(0, limit), "asciiArrows", (a) => fieldLine(a.collection, a.id, a.field)),
        ...blockOf(issues.unresolvedExpressions, "unresolvedExpressions", (e) => expressionLine(e.from, e.target)),
        ...blockOf(issues.undeclaredAdjacentPairs.slice(0, limit), "undeclaredAdjacentPairs", (p) =>
            pairLine(p.kind, p.a, p.b, p.basis),
        ),
        ...blockOf(issues.invalidRecordDistincts, "invalidRecordDistincts", (d) =>
            distinctLine(d.from, d.target, d.reason),
        ),
        ...blockOf(issues.aliasDefects, "aliasDefects", (d) => aliasLine(d.ref, d.alias, d.reason)),
        ...blockOf(issues.repairDefects, "repairDefects", (d) => repairLine(d.ref, d.field, d.target, d.reason)),
        ...blockOf(issues.emptyRequiredFields.slice(0, limit), "emptyRequiredFields", (f) =>
            fieldLine(f.collection, f.id, f.field),
        ),
        ...blockOf(issues.unresolvedShapeInstances, "unresolvedShapeInstances", (i) =>
            shapeInstanceLine(i.shape, i.instance),
        ),
        ...blockOf(issues.ambiguousReasonRefs, "ambiguousReasonRefs", (r) => ambiguousLine(r.from, r.target, r.kinds)),
        ...blockOf(issues.idShapedEdgeLabels, "idShapedEdgeLabels", (l) => edgeLabelLine(l.from, l.label)),
        ...blockOf(issues.unresolvedCheckRefs, "unresolvedCheckRefs", (r) =>
            checkRefLine(r.collection, r.id, r.field, r.ref),
        ),
        ...blockOf(issues.checkDeclarationDefects, "checkDeclarationDefects", (d) =>
            declarationLine(d.check, d.field, d.ref, d.resolved),
        ),
        ...blockOf(issues.secondCheckHomes, "secondCheckHomes", (h) => fieldLine(h.collection, h.id, h.home)),
        ...blockOf(issues.uncoveredCollections, "uncoveredCollections", (name) => name),
        ...blockOf(issues.uncheckedRecords.slice(0, limit), "uncheckedRecords", (u) =>
            uncheckedLine(u.collection, u.id, u.missing),
        ),
        ...blockOf(issues.unknownRecordKeys, "unknownRecordKeys", (k) =>
            unknownKeyLine(k.collection, k.record, k.key, k.reason),
        ),
        ...blockOf(issues.unresolvedReasonEdges, "unresolvedReasonEdges", reasonEdgeLine),
        ...blockOf(issues.unresolvedLensDetectors, "unresolvedLensDetectors", (d) => lensLine(d.lens, d.target)),
        ...blockOf(issues.unresolvedGrammarGrounds, "unresolvedGrammarGrounds", (g) => groundLine(g.from, g.target)),
        ...blockOf(issues.relationKindViolations, "relationKindViolations", (v) =>
            relationLine(v.from, v.relation, v.target, v.kind, v.allowed),
        ),
    ];
};
