import {
    BACKLOG_HEADING,
    CANDIDATES_HEADING,
    COMPOSES_HEADING,
    DIVERGENT_HEADING,
    NATIVE_LINES,
    PAG_LINES,
    TARGETS_HEADING,
    candidateLine,
    composesLine,
    divergentLine,
    moreTargets,
    remediationLines,
    targetLine,
    targetTrail,
} from "#configuration/strings/ontology.report.strings";
import { SAMPLE, TRAIL_SAMPLE } from "#configuration/constants/invocation.constants";
import { failedItem, listedItem } from "#configuration/strings/validation.report.strings";
import type { ResolutionIssues } from "#types/validation.types";
import { relativePath } from "@ssot/paths";
import { slugify } from "#core/converters/identifier.converter";

const TARGET_JOINER = ".";

export const targetsOf = function targetsOf(issues: ResolutionIssues): [string, string[]][] {
    const byTarget = new Map<string, string[]>();
    for (const edge of issues.unresolvedArchEdges) {
        byTarget.set(edge.target, [
            ...(byTarget.get(edge.target) ?? []),
            `${edge.from}${TARGET_JOINER}${edge.relation}`,
        ]);
    }
    return [...byTarget].toSorted((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
};

export const targetLines = function targetLines(issues: ResolutionIssues, list: boolean): string[] {
    const ranked = targetsOf(issues);
    if (ranked.length === 0) {
        return [];
    }
    const shown = list ? ranked : ranked.slice(0, SAMPLE);
    const lexDir = `${relativePath("govlab.context.lexicon")}/`;
    const lines = shown.flatMap(([target, sites]) => [
        targetLine(
            target,
            sites.length,
            list ? targetTrail(sites.slice(0, TRAIL_SAMPLE), sites.length > TRAIL_SAMPLE) : "",
        ),
        ...(list ? remediationLines(target, slugify(target), lexDir) : []),
    ]);
    const composes =
        list && issues.unresolvedAlgoComposes.length > 0
            ? [COMPOSES_HEADING, ...issues.unresolvedAlgoComposes.map((c) => composesLine(c.from, c.target))]
            : [];
    return [TARGETS_HEADING, ...lines, ...(list ? composes : [moreTargets(Math.max(0, ranked.length - SAMPLE))])];
};

const integrityLines = function integrityLines(issues: ResolutionIssues): string[] {
    const { integrity } = issues;
    return [
        ...(integrity.intraGrammarDivergentSymbols.length > 0
            ? [
                  DIVERGENT_HEADING,
                  ...integrity.intraGrammarDivergentSymbols.map((s) =>
                      failedItem(divergentLine(s.grammar, s.name, s.definedIn)),
                  ),
              ]
            : []),
        ...(integrity.crossCatalogRedundancy.length > 0
            ? [CANDIDATES_HEADING, ...integrity.crossCatalogRedundancy.map((p) => listedItem(candidateLine(p.a, p.b)))]
            : []),
    ];
};

const nativeDetailLines = function nativeDetailLines(issues: ResolutionIssues): string[] {
    const rn = issues.reasonNative;
    return [
        ...rn.invalidStages.map((d) => NATIVE_LINES.invalidStage(d.id, d.stage)),
        ...rn.invalidAxes.map((d) => NATIVE_LINES.invalidAxis(d.id, d.axis)),
        ...rn.invalidMathTypes.map((d) => NATIVE_LINES.invalidMathType(d.id, d.mathType)),
        ...rn.stageAxisMismatches.map((d) => NATIVE_LINES.stageAxis(d.id, d.stage, d.expected, d.axis)),
        ...rn.yieldsShapeMismatches.map((d) => NATIVE_LINES.yieldsShape(d.id, d.yields, d.mathType, d.allowed)),
        ...rn.derivationMapDefects.map((d) => `${d.id} — ${d.reason}`),
        ...rn.duplicateLoopGroundings.map((g) => NATIVE_LINES.duplicateLoop(g.domain, g.records)),
        ...rn.metaLoopGroundings.map(NATIVE_LINES.metaLoop),
        ...rn.metaKernelNaming.map(NATIVE_LINES.metaKernel),
    ];
};

const pagDetailLines = function pagDetailLines(issues: ResolutionIssues): string[] {
    return [
        ...issues.duplicateKeywordIds.map(PAG_LINES.duplicateKeyword),
        ...issues.danglingTemplateSlots.map((s) => PAG_LINES.danglingSlot(s.type, s.slot)),
        ...issues.docTypesWithoutVerb.map(PAG_LINES.verbless),
        ...issues.unknownTemplateTypes.map(PAG_LINES.unknownTemplateType),
        ...issues.unrecognizedDocumentTypes.map(PAG_LINES.unrecognizedType),
        ...issues.unrecognizedDocumentVerbs.map((v) => PAG_LINES.unrecognizedVerb(v.type, v.verb)),
        ...issues.danglingNonterminals.map((n) => PAG_LINES.danglingNonterminal(n.production, n.ref)),
        ...issues.unusedTerminals.map(PAG_LINES.unusedTerminal),
        ...issues.ungroundedPagConstructs.map(PAG_LINES.ungroundedConstruct),
        ...issues.unresolvedPagGrounds.map((g) => PAG_LINES.unresolvedGround(g.from, g.target)),
        ...issues.doctypeModelAxis.map(PAG_LINES.doctypeModelAxis),
    ];
};

export const listDetailLines = function listDetailLines(issues: ResolutionIssues): string[] {
    const untyped = issues.reasonNative.untypedRecords;
    return [
        ...integrityLines(issues),
        ...[...nativeDetailLines(issues), ...pagDetailLines(issues)].map(failedItem),
        ...(untyped.length > 0 ? [BACKLOG_HEADING, ...untyped.map(listedItem)] : []),
    ];
};
