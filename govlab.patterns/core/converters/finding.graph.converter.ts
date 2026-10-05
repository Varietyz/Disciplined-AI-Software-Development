import { GRAPH_STRINGS, NULL_MODEL_LABELS } from "#configuration/strings/representation.strings";
import { explanationFinding, makeFinding, reasonOf } from "#core/factories/finding.factory";
import type { Finding } from "#types/finding.types";
import type { GraphSummary } from "#types/representation.types";
import { ROUNDING } from "#configuration/constants/math.constants";
import { coordinate } from "#core/factories/axis.factory";
import { fixedTo } from "#core/normalizers/math.normalizer";
import { withSupport } from "#core/converters/finding.converter";

const LIFT_KEY = "lift";

const pairRows = function pairRows(
    rows: readonly [string[], number][],
    key: string,
): Readonly<Record<string, unknown>>[] {
    return rows.map(([pair, value]) => ({ [key]: key === LIFT_KEY ? fixedTo(value, ROUNDING.fine) : value, pair }));
};

const structureFindings = function structureFindings(field: string, summary: GraphSummary): Finding[] {
    return [
        explanationFinding({
            analysis: "relation",
            explained: GRAPH_STRINGS.cooccurrenceExplained,
            field,
            name: "cooccurrence",
            observation: {
                distinctTargets: summary.distinctTargets,
                edges: summary.edges,
                meanDegree: fixedTo(summary.meanDegree, ROUNDING.fine),
                topPairs: pairRows(summary.topPairs, "count"),
            },
            observed: GRAPH_STRINGS.cooccurrenceObserved(
                String(summary.distinctTargets),
                summary.meanDegree.toFixed(ROUNDING.standard),
            ),
            ontology: "relation",
            representation: "topology",
        }),
        explanationFinding({
            analysis: "relation",
            explained: GRAPH_STRINGS.liftExplained,
            field,
            name: LIFT_KEY,
            observation: { topLift: pairRows(summary.topLift, LIFT_KEY) },
            observed: GRAPH_STRINGS.liftObserved,
            ontology: "relation",
            representation: "probability",
        }),
        explanationFinding({
            analysis: "structure",
            explained: GRAPH_STRINGS.positionalExplained,
            field,
            name: "positional",
            observation: {
                positional: summary.positional.map(([index, value, count]) => ({ count, index, value })),
                slotPatterns: summary.slotPatterns.map(([index, from, to, count]) => ({ count, from, index, to })),
            },
            observed: GRAPH_STRINGS.positionalObserved,
            ontology: "structure",
            representation: "symbolic",
        }),
        explanationFinding({
            analysis: "structure",
            explained: GRAPH_STRINGS.combinatoricsExplained(summary.repeatRate.toFixed(ROUNDING.standard)),
            field,
            name: "combinatorics",
            observation: { distinctSets: summary.distinctSets, repeatRate: fixedTo(summary.repeatRate, ROUNDING.fine) },
            observed: GRAPH_STRINGS.combinatoricsObserved(String(summary.distinctSets)),
            ontology: "composition",
            representation: "computation",
        }),
    ];
};

const uniformityFinding = function uniformityFinding(field: string, summary: GraphSummary): Finding {
    const member = summary.memberUniformity;
    const verdict = member.uniform ? GRAPH_STRINGS.membersUniform : GRAPH_STRINGS.membersDepart;
    const observed = GRAPH_STRINGS.uniformityObserved(member.chiSquare.toFixed(ROUNDING.coarse), String(member.dof));
    return makeFinding({
        coordinate: coordinate({
            analysis: "statistical",
            ontology: "probability",
            reasoning: "explanation",
            representation: "probability",
        }),
        field,
        name: "member-uniformity",
        narrative: reasonOf(observed, GRAPH_STRINGS.uniformityExplained(verdict)),
        observation: {
            memberUniformity: member,
            topMembers: summary.topMembers.map(([value, count]) => ({ count, value })),
        },
        significance: {
            nullModel: NULL_MODEL_LABELS.memberUniformity,
            pValue: member.pValue,
            significant: !member.uniform,
            statistic: member.chiSquare,
        },
    });
};

const compositionFinding = function compositionFinding(field: string, summary: GraphSummary): Finding | null {
    const { composition } = summary;
    if (composition === null) {
        return null;
    }
    return explanationFinding({
        analysis: "structure",
        explained: GRAPH_STRINGS.compositionExplained(composition.highRatio.toFixed(ROUNDING.standard)),
        field,
        name: "composition",
        observation: {
            composition: {
                highRatio: fixedTo(composition.highRatio, ROUNDING.fine),
                oddRatio: fixedTo(composition.oddRatio, ROUNDING.fine),
            },
        },
        observed: GRAPH_STRINGS.compositionObserved(composition.oddRatio.toFixed(ROUNDING.standard)),
        ontology: "composition",
        representation: "number",
    });
};

const orderedFinding = function orderedFinding(field: string, summary: GraphSummary): Finding | null {
    const { ordered } = summary;
    if (ordered === null) {
        return null;
    }
    return explanationFinding({
        analysis: "space",
        explained: GRAPH_STRINGS.orderedExplained(ordered.symmetry.toFixed(ROUNDING.standard)),
        field,
        name: "ordered-domain",
        observation: {
            ordered: {
                adjacencyRate: fixedTo(ordered.adjacencyRate, ROUNDING.fine),
                bands: ordered.bands,
                symmetry: fixedTo(ordered.symmetry, ROUNDING.fine),
            },
        },
        observed: GRAPH_STRINGS.orderedObserved(ordered.adjacencyRate.toFixed(ROUNDING.standard)),
        ontology: "space",
        representation: "geometry",
    });
};

export const graphFindings = function graphFindings(field: string, summary: GraphSummary): Finding[] {
    return withSupport(
        [
            uniformityFinding(field, summary),
            ...structureFindings(field, summary),
            compositionFinding(field, summary),
            orderedFinding(field, summary),
        ],
        summary.records,
    );
};
