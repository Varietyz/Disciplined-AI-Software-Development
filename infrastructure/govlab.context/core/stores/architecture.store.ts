import { ARCHITECTURE_LABEL, COLLECTIONS } from "#configuration/constants/ontology.constants";
import type {
    ArchRelations,
    ArchRelationsOptions,
    EdgeRelation,
    Principle,
    PrincipleEdge,
    PrincipleFilter,
    ResolveResult,
} from "#types/architecture.types";
import { EDGE_FIELDS, ID_EDGE_PREFIX, LABEL_EDGE_PREFIX } from "#configuration/constants/architecture.constants";
import type { Edge, OntologyIssues } from "#types/ontology.types";
import { BaseOntology } from "#core/stores/ontology.store";
import { ReadAudit } from "#core/observers/record.observer";
import { loadPrinciples } from "#core/loaders/architecture.loader";
import { matchesPrinciple } from "#core/matchers/architecture.matcher";
import { slugify } from "#core/converters/identifier.converter";

const edgesOf = function edgesOf(principle: Principle): Edge[] {
    return EDGE_FIELDS.map(({ field, relation }) => ({ relation, targets: principle[field] }));
};

const dedupeEdges = function dedupeEdges(edges: PrincipleEdge[]): PrincipleEdge[] {
    const seen = new Set<string>();
    const out: PrincipleEdge[] = [];
    for (const edge of edges) {
        const key = typeof edge === "string" ? `${LABEL_EDGE_PREFIX}${edge}` : `${ID_EDGE_PREFIX}${edge.id}`;
        if (!seen.has(key)) {
            seen.add(key);
            out.push(edge);
        }
    }
    return out;
};

export class ArchitectureStore extends BaseOntology<Principle, PrincipleFilter> implements ArchRelations {
    private readonly resolveId: (term: string) => string;

    public constructor(options: ArchRelationsOptions = {}, audit = new ReadAudit(COLLECTIONS.architecture)) {
        super(loadPrinciples(audit, options.data), {
            audit,
            idOf: (principle) => principle.id,
            label: ARCHITECTURE_LABEL,
            logger: options.logger,
            matches: matchesPrinciple,
        });
        const base = options.canonicalizeId ?? slugify;
        const aliasByKey = new Map<string, string>();
        for (const principle of this.all()) {
            for (const label of [principle.name, ...(principle.aliases ?? [])]) {
                aliasByKey.set(slugify(label), principle.id);
            }
        }
        this.resolveId = (term): string => aliasByKey.get(slugify(term)) ?? base(term);
    }

    public resolve = (ids: string[]): ResolveResult => {
        const selected = ids
            .map((id) => this.get(id))
            .filter((principle): principle is Principle => principle !== null);
        const resolveEdge = (target: string): PrincipleEdge => this.get(this.resolveId(target)) ?? target;
        const flatEdge = (field: EdgeRelation): PrincipleEdge[] =>
            dedupeEdges(selected.flatMap((principle) => principle[field]).map(resolveEdge));
        return {
            edges: {
                conflictsWith: flatEdge("conflicts_with"),
                enables: flatEdge("enables"),
                reinforces: flatEdge("reinforces"),
                requires: flatEdge("requires"),
                tensionsWith: flatEdge("tensions_with"),
            },
            principles: selected,
            refactorRecipes: selected.map((principle) => ({
                detectedBy: principle.detected_by,
                id: principle.id,
                refactoredBy: principle.refactored_by,
                violatedBy: principle.violated_by ?? [],
            })),
        };
    };

    public validateOntology = (): OntologyIssues => this.validateEdges(edgesOf, this.resolveId);
}
