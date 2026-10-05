import { EVIDENCE_RELATION_ID, LINKS_TO_RELATION, USES_RELATION } from "@banes-lab/web/constants/graph.constants";

export const NO_CLOSURE_REPORT = "The build produced no link closure report.";

export const linksLine = function linksLine(count: number, file: string): string {
    return `links: linked the tabs of ${String(count)} page(s) into ${file}\n`;
};

export const EVIDENCE_IN_BOTH = "This record is in both EVIDENCE and EVIDENCE_ABSENT.";

export const EVIDENCE_IN_NEITHER = "This record, which the site links to, is in neither EVIDENCE nor EVIDENCE_ABSENT.";

export const unresolvedLink = function unresolvedLink(label: string, target: string): string {
    return `The link "${label}" points to ${target}, which no catalog section, record or source file carries.`;
};

export const missingBacklink = function missingBacklink(target: string): string {
    return `This page links to ${target}, and the page for ${target} does not list it under "Linked from". Both lists come from sectionEdges in section.converter.ts.`;
};

export const missingGround = function missingGround(target: string): string {
    return `This page cites ${target} as evidence, and the page for ${target} does not list it under "Grounds". The "Grounds" list comes from the evidence edges in the relation graph report.`;
};

export const missingUsedBy = function missingUsedBy(target: string): string {
    return `This file uses ${target}, and the page for ${target} does not list it under "Used by". Both lists come from the call edges in the anatomy snapshot.`;
};

export const LEAF_REVERSE_MESSAGES: ReadonlyMap<string, (target: string) => string> = new Map([
    [LINKS_TO_RELATION, missingBacklink],
    [EVIDENCE_RELATION_ID, missingGround],
    [USES_RELATION, missingUsedBy],
]);

export const noLeafReverseMessage = function noLeafReverseMessage(relation: string): string {
    return `link: the relation "${relation}" declares catalog leaf fields and has no reverse message. Add its message to LEAF_REVERSE_MESSAGES.`;
};

export const missingReverse = function missingReverse(label: string, target: string): string {
    return `This record lists ${target} under "${label}", and the page for ${target} does not list this record. Both pages take their lists from the relation graph's ontology edges, through inboundRelations and outboundRelations in graph.converter.ts.`;
};
