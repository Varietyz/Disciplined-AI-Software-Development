import { ALGO_FACE, ARCH_FACE, LEX_FACE, REFERENCED_BY_RELATION } from "@govlab/constants";
import type { PrincipleCategoryView, TermCategoryView, TermView } from "@banes-lab/web/types/ontology.types.js";
import { distinctsOf, exemplarOf, groupBy, layerRef, orNull } from "#core/converters/view.converter";
import { EXAMPLE_SHAPE_VOCABULARY } from "#configuration/constants/ontology.constants";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { OntologySources } from "#types/ontology.types";
import type { Term } from "@govlab/context";
import { lookup } from "#core/converters/ontology.index.converter";
import { refOf } from "#core/resolvers/ontology.resolver";

const twinsOf = function twinsOf(principles: readonly PrincipleCategoryView[]): ReadonlyMap<string, EdgeRef> {
    return new Map(
        principles
            .flatMap((group) => group.principles)
            .flatMap((principle) => {
                const term = principle.term?.ref ?? null;
                return term === null
                    ? []
                    : [[term, { label: principle.name, ref: refOf(ARCH_FACE, principle.id) }] as const];
            }),
    );
};

const termView = function termView(
    sources: OntologySources,
    twins: ReadonlyMap<string, EdgeRef>,
    term: Term,
): TermView {
    const { resolve } = sources;
    const contract = sources.context.algo.get(term.id);
    return {
        aliases: term.aliases,
        category: resolve.lexCategory(term.category),
        contract: contract === null ? null : { label: contract.title, ref: refOf(ALGO_FACE, contract.id) },
        definition: term.definition,
        distinctFrom: distinctsOf(term.distinctFrom, resolve.target),
        example: orNull(term.example),
        exemplar: exemplarOf(term.exemplar),
        id: term.id,
        kind: resolve.kind(term.kind),
        layer: layerRef(sources, term.id),
        name: term.name,
        principle: twins.get(refOf(LEX_FACE, term.id)) ?? null,
        referencedBy: lookup(sources.index, REFERENCED_BY_RELATION, LEX_FACE, term.id),
    };
};

export const termsOf = function termsOf(
    sources: OntologySources,
    principles: readonly PrincipleCategoryView[],
): readonly TermCategoryView[] {
    const twins = twinsOf(principles);
    return groupBy(sources.context.lex.all(), (term) => term.category).map(([category, terms]) => {
        const shape = terms.find((term) => term.exampleShape !== undefined)?.exampleShape;
        return {
            category: sources.resolve.lexCategory(category).label,
            exampleShape: shape === undefined ? null : sources.resolve.vocabulary(EXAMPLE_SHAPE_VOCABULARY, shape),
            id: category,
            terms: terms.map((term) => termView(sources, twins, term)),
        };
    });
};
