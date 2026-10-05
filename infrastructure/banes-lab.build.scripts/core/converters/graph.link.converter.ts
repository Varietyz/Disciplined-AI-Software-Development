import { BUILDS_ON_RELATION, EVIDENCE_RELATION_ID, LINKS_TO_RELATION } from "@banes-lab/web/constants/graph.constants";
import type { RouteEdges, SiteScope } from "#types/graph.types";
import { CHAPTER_PREFIX } from "#configuration/constants/graph.constants";
import type { EvidenceNode } from "@banes-lab/web/types/evidence.types.js";
import type { GraphEdge } from "@banes-lab/web/types/graph.types.js";
import type { RouteStop } from "#types/learning.types";
import type { WebModules } from "#types/loader.types";
import { sectionEdges } from "#core/converters/section.converter";
import { unresolvedEvidence } from "#configuration/strings/graph.strings";

const FACE_MARK = ":";

const refsOf = function refsOf(links: readonly { readonly ref: string | null }[]): readonly string[] {
    return links.flatMap((link) => (link.ref === null ? [] : [link.ref]));
};

export const linkEdges = function linkEdges(scope: Pick<SiteScope, "linker" | "plans">): readonly GraphEdge[] {
    const { outgoing } = sectionEdges(scope.plans, scope.linker);
    const relation = LINKS_TO_RELATION;
    return [...outgoing.entries()].flatMap(([from, links]) => refsOf(links).map((to) => ({ from, relation, to })));
};

export const evidenceEdges = function evidenceEdges(
    web: Pick<WebModules, "evidence" | "evidenceConstants">,
    targetOf: (node: EvidenceNode) => string | null,
    subjects: readonly string[],
): readonly GraphEdge[] {
    const relation = EVIDENCE_RELATION_ID;
    return subjects.flatMap((from) =>
        web.evidence
            .evidenceFor({ face: from.slice(0, from.indexOf(FACE_MARK)), ref: from }, web.evidenceConstants.EVIDENCE)
            .flatMap((entry) => entry.nodes)
            .map((node) => {
                const to = targetOf(node);
                if (to === null) {
                    throw new Error(unresolvedEvidence(from, node));
                }
                return { from, relation, to };
            }),
    );
};

export const routeEdges = function routeEdges(stops: readonly RouteStop[]): RouteEdges {
    const pathOf = new Map(stops.map((stop) => [stop.id, stop.path]));
    const relation = BUILDS_ON_RELATION;
    const required = stops.flatMap((stop) => stop.requires.map((id) => ({ id, path: pathOf.get(id), stop })));
    return {
        edges: required.flatMap(({ path, stop }) =>
            path === undefined ? [] : [{ from: CHAPTER_PREFIX + stop.path, relation, to: CHAPTER_PREFIX + path }],
        ),
        unresolved: required
            .filter(({ path }) => path === undefined)
            .map(({ id, stop }) => ({ from: CHAPTER_PREFIX + stop.path, label: id, relation })),
    };
};
