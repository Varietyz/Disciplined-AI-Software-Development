import type { GraphEdge, GraphNode } from "@banes-lab/web/types/graph.types.js";
import type { GraphFiles, GraphLines } from "#types/graph.types";
import type { EvidenceNode } from "@banes-lab/web/types/evidence.types.js";

export const graphLines = function graphLines(lines: GraphLines, files: GraphFiles): string {
    const { report, search } = lines;
    const { positions } = search;
    return [
        `learning: wrote ${String(lines.stops)} stop(s) into ${files.learning}`,
        `tabs: wrote ${String(lines.routes)} tab route(s) into ${files.tabs}`,
        `graph: derived ${String(report.graph.nodes.length)} node(s) and ${String(report.graph.edges.length)} edge(s) from ${String(lines.records)} record(s) into ${files.report}`,
        `graph: found ${String(report.undeclared.length)} undeclared relation(s), ${String(report.ambiguous.length)} ambiguous relation(s), ${String(report.unresolved.length)} unresolved target(s) and ${String(report.dangling.length)} dangling edge(s)`,
        `graph: wrote ${String(lines.chunks)} chunk(s) beside ${files.graph}`,
        `search: wrote ${String(Object.keys(positions.route).length)} route position(s), ${String(Object.keys(positions.links).length)} link position(s), ${String(Object.keys(positions.evidence).length)} evidence position(s) and ${String(search.definitions.length)} definition(s) into ${files.search}`,
        "",
    ].join("\n");
};

export const POPULATION_NOUNS: ReadonlyMap<string, string> = new Map([
    ["node links", "link"],
    ["site numbers", "number"],
]);

export const NO_GRAPH_REPORT = "The build produced no relation graph report.";

export const missingPopulation = function missingPopulation(population: string): string {
    return `graph: the report carries no ${population} population. The records population counts every record the graph reads.`;
};

export const graphReportMissing = function graphReportMissing(report: string): string {
    return `catalog: the relation graph report is missing at ${report}. Run the build's graph step before the catalog.`;
};

export const graphReportEmpty = function graphReportEmpty(report: string): string {
    return `catalog: the relation graph report at ${report} carries no graph. Run the build's graph step again to rewrite it.`;
};

export const missingReportList = function missingReportList(key: string): string {
    return `The relation graph report holds no ${key} list, so none of its entries were checked.`;
};

export const malformedReportEntries = function malformedReportEntries(key: string, count: number): string {
    return `${String(count)} entry(s) in the ${key} list of the relation graph report do not have the shape the check reads, so they were not checked.`;
};

export const sharedNumber = function sharedNumber(number: string, first: string, second: string): string {
    return `The number ${number} is carried by both ${first} and ${second}.`;
};

export const undeclaredAbsence = function undeclaredAbsence(
    count: number,
    kind: string,
    layer: string,
    noun: string,
): string {
    return `${String(count)} ${kind} node(s) in the ${layer} layer have no ${noun}, and EXPECTED_ABSENCES does not declare it. Give them one, or declare the absence with its reason.`;
};

export const emptyPopulation = function emptyPopulation(name: string): string {
    return `The relation graph report read no ${name}.`;
};

export const unbalancedPopulation = function unbalancedPopulation(name: string, sum: number, whole: number): string {
    return `The ${name} parts in the relation graph report add up to ${String(sum)}, and ${String(whole)} were read.`;
};

export const undeclaredRelation = function undeclaredRelation(face: string, relation: string): string {
    return `The ${face} collection stores the relation "${relation}", which neither RELATION_PAIRS nor GRAPH_FIELD_RULES declares.`;
};

export const ambiguousRelation = function ambiguousRelation(face: string, relation: string): string {
    return `The ${face} collection stores the relation "${relation}", which reverses more than one pair in RELATION_PAIRS. Declare the relation it means in GRAPH_FIELD_RULES.`;
};

export const unresolvedTarget = function unresolvedTarget(from: string, label: string, relation: string): string {
    return `The record ${from} names "${label}" in its ${relation} field, and no record has that id. Change the entry to the id of the record it means, or move the text to a field that holds text.`;
};

export const duplicateNode = function duplicateNode(kept: GraphNode, dropped: GraphNode): string {
    return `Two parts of the graph build derive the node ${kept.ref}, as a ${kept.kind} in the ${kept.layer} layer and as a ${dropped.kind} in the ${dropped.layer} layer. Keep one derivation, or give the second node its own ref.`;
};

export const unresolvedEvidence = function unresolvedEvidence(from: string, node: EvidenceNode): string {
    const named = node.kind === "folder" ? node.words.join(" ") : node.name;
    return `graph: the evidence for ${from} names the ${node.kind} "${named}", which no anatomy tree holds, so its evidence edge would be lost. Point the entry at the construct as it is named now, or move ${from} to EVIDENCE_ABSENT with its reason.`;
};

export const unknownTargetKind = function unknownTargetKind(target: string): string {
    return `graph: the reference target ${target} has a kind no graph ref is mapped for. Map the kind in codeTargetRefOf.`;
};

export const duplicateProducer = function duplicateProducer(producer: string): string {
    return `graph: two producer files register the name ${producer}. Rename one of them, because the name keys the producer registry.`;
};

export const uncoveredSection = function uncoveredSection(ref: string): string {
    return `The teaching section ${ref} links no ontology record. Link the record the section teaches.`;
};

export const tooltipGap = function tooltipGap(edge: GraphEdge): string {
    return `The tooltip chunk for ${edge.from} does not carry the ${edge.relation} edge to ${edge.to} that the relation graph holds.`;
};

export const danglingEdge = function danglingEdge(edge: GraphEdge): string {
    return `The edge "${edge.relation}" from ${edge.from} to ${edge.to} names a node the graph does not hold; a rename, a move, a deletion or a layer the graph does not build yet leaves an edge like this.`;
};
