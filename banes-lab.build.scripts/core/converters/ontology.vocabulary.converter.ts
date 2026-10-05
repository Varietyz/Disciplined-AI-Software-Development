import { ALGO_FACE, ARCH_FACE, LEX_CATEGORY_FACE, REASON_FACE, TENSION_FACE, VOCABULARY_FACE } from "@govlab/constants";
import { refOf, vocabularyAnchor } from "#core/resolvers/ontology.resolver";
import { CLOSED_VOCABULARIES } from "@govlab/context";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { VocabularyUsers } from "#types/ontology.types";
import type { VocabularyView } from "@banes-lab/web/types/ontology.types.js";

const PAIR_JOINER = " / ";
const FLOW_JOINER = " → ";

type Use = readonly [string | null, EdgeRef];

const usesOf = function usesOf(users: VocabularyUsers): readonly Use[] {
    return [
        ...users.principles.flatMap((group) =>
            group.principles.map((principle): Use => [
                principle.severity.ref,
                { label: principle.name, ref: refOf(ARCH_FACE, principle.id) },
            ]),
        ),
        ...users.contracts.flatMap((group) =>
            group.contracts.map((contract): Use => [
                contract.tier.ref,
                { label: contract.title, ref: refOf(ALGO_FACE, contract.id) },
            ]),
        ),
        ...users.surfaces.flatMap((surface) =>
            [surface.evidenceSource, surface.predicateType, ...surface.verdictDomain].map((value): Use => [
                value.ref,
                { label: surface.id, ref: refOf(REASON_FACE, surface.anchor) },
            ]),
        ),
        ...users.topology.map((edge): Use => [
            edge.kind.ref,
            { label: edge.from.label + FLOW_JOINER + edge.to.label, ref: edge.from.ref },
        ]),
        ...users.tensions.map((tension): Use => [
            tension.mechanism.ref,
            { label: tension.a.label + PAIR_JOINER + tension.b.label, ref: refOf(TENSION_FACE, tension.id) },
        ]),
        ...users.terms.map((group): Use => [
            group.exampleShape?.ref ?? null,
            { label: group.category, ref: refOf(LEX_CATEGORY_FACE, group.id) },
        ]),
    ];
};

export const vocabulariesOf = function vocabulariesOf(users: VocabularyUsers): readonly VocabularyView[] {
    const uses = usesOf(users);
    return CLOSED_VOCABULARIES.map((vocabulary) => ({
        entries: vocabulary.entries.map((entry) => {
            const ref = refOf(VOCABULARY_FACE, vocabularyAnchor(vocabulary.id, entry.value));
            return {
                definition: entry.definition,
                records: uses.filter(([held]) => held === ref).map(([, record]) => record),
                value: entry.value,
            };
        }),
        id: vocabulary.id,
    }));
};
