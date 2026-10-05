import {
    ALGO_DOMAIN_FACE,
    ALGO_FACE,
    ARCH_CATEGORY_FACE,
    ARCH_FACE,
    CONTRACTS_RELATION,
    FORCE_FACE,
    KIND_FACE,
    LEX_CATEGORY_FACE,
    LEX_FACE,
    PRINCIPLE_RELATION,
    RELATION_FACE,
    VOCABULARY_FACE,
} from "@govlab/constants";
import {
    CONTRACT_MEMBER,
    PRINCIPLE_MEMBER,
    TERM_MEMBER,
    forceSummary,
    forceTitleOf,
    groupSummary,
    groupTitleOf,
    relationSummary,
} from "@banes-lab/web/strings/catalog.strings";
import type { ReferenceIndex, ReferenceRecord } from "@banes-lab/web/types/reference.types.js";
import { hyphenatedOf, relationsOf } from "#core/converters/reference.field.converter";
import { refOf, vocabularyAnchor } from "#core/resolvers/ontology.resolver";
import { CLOSED_VOCABULARIES } from "@govlab/context";
import type { OntologySnapshot } from "@banes-lab/web/types/ontology.types.js";
import { relationLabelOf } from "@banes-lab/web/strings/reference.strings";
import { unknownSnapshotVocabulary } from "#configuration/strings/ontology.strings";

const LIST_JOINER = ", ";
const FORCE_KIND = "force";
const KIND_KIND = "kind";
const RELATION_KIND = "relation";
const CATEGORY_KIND = "category" as const;
const DOMAIN_KIND = "domain" as const;
const TERMS_RELATION = "terms";
const KINDS_RELATION = "kinds";
const REVERSE_SUFFIX = "-of";

type SummaryArguments = Parameters<typeof groupSummary>;

interface Grouped {
    readonly edges: readonly { readonly label: string; readonly ref: string }[];
    readonly id: string;
    readonly kind: SummaryArguments[1];
    readonly member: SummaryArguments[3];
    readonly relation: string;
    readonly title: string;
}

const groupRecord = function groupRecord(group: Grouped): ReferenceRecord {
    return {
        code: null,
        kind: group.kind,
        layer: null,
        name: group.title,
        relations: [{ edges: group.edges, relation: group.relation }],
        summary: groupSummary(group.title, group.kind, group.edges.length, group.member),
    };
};

const indexOf = function indexOf(face: string, groups: readonly Grouped[]): ReferenceIndex {
    return Object.fromEntries(groups.map((group) => [refOf(face, group.id), groupRecord(group)]));
};

const archCategories = function archCategories(snapshot: OntologySnapshot): ReferenceIndex {
    return indexOf(
        ARCH_CATEGORY_FACE,
        snapshot.principles.map((group) => ({
            edges: group.principles.map((principle) => ({
                label: principle.name,
                ref: refOf(ARCH_FACE, principle.id),
            })),
            id: group.id,
            kind: CATEGORY_KIND,
            member: PRINCIPLE_MEMBER,
            relation: PRINCIPLE_RELATION,
            title: groupTitleOf(group.id, group.category),
        })),
    );
};

const lexCategories = function lexCategories(snapshot: OntologySnapshot): ReferenceIndex {
    return indexOf(
        LEX_CATEGORY_FACE,
        snapshot.terms.map((group) => ({
            edges: group.terms.map((term) => ({ label: term.name, ref: refOf(LEX_FACE, term.id) })),
            id: group.id,
            kind: CATEGORY_KIND,
            member: TERM_MEMBER,
            relation: TERMS_RELATION,
            title: groupTitleOf(group.id, group.category),
        })),
    );
};

const algoDomains = function algoDomains(snapshot: OntologySnapshot): ReferenceIndex {
    return indexOf(
        ALGO_DOMAIN_FACE,
        snapshot.contracts.map((group) => ({
            edges: group.contracts.map((contract) => ({ label: contract.title, ref: refOf(ALGO_FACE, contract.id) })),
            id: group.id,
            kind: DOMAIN_KIND,
            member: CONTRACT_MEMBER,
            relation: CONTRACTS_RELATION,
            title: groupTitleOf(group.id, group.domain),
        })),
    );
};

const forces = function forces(snapshot: OntologySnapshot): ReferenceIndex {
    return Object.fromEntries(
        snapshot.forces.map((view) => [
            refOf(FORCE_FACE, view.id),
            {
                code: null,
                kind: FORCE_KIND,
                layer: null,
                name: forceTitleOf(view.force),
                relations: [...relationsOf(view)],
                summary:
                    view.concerns.length === 0
                        ? forceSummary(view.contracts.length, view.principles.length)
                        : view.concerns.join(LIST_JOINER),
            },
        ]),
    );
};

const kinds = function kinds(snapshot: OntologySnapshot): ReferenceIndex {
    return Object.fromEntries(
        snapshot.kinds.map((view) => [
            refOf(KIND_FACE, view.kind),
            { code: null, kind: KIND_KIND, layer: null, name: view.kind, relations: [], summary: view.discriminator },
        ]),
    );
};

const relations = function relations(snapshot: OntologySnapshot): ReferenceIndex {
    return Object.fromEntries(
        snapshot.ranges.map((view) => [
            refOf(RELATION_FACE, view.relation),
            {
                code: null,
                kind: RELATION_KIND,
                layer: null,
                name: relationLabelOf(hyphenatedOf(view.relation)),
                relations: view.kinds.length === 0 ? [] : [{ edges: view.kinds, relation: KINDS_RELATION }],
                summary: relationSummary(view.kinds.map((edge) => edge.label)),
            },
        ]),
    );
};

const relationOfVocabulary = function relationOfVocabulary(id: string): string {
    const held = CLOSED_VOCABULARIES.find((vocabulary) => vocabulary.id === id);
    if (held === undefined) {
        throw new Error(unknownSnapshotVocabulary(id));
    }
    return held.relation + REVERSE_SUFFIX;
};

const vocabularies = function vocabularies(snapshot: OntologySnapshot): ReferenceIndex {
    return Object.fromEntries(
        snapshot.vocabularies.flatMap((vocabulary) => {
            const relation = relationOfVocabulary(vocabulary.id);
            return vocabulary.entries.map((entry) => [
                refOf(VOCABULARY_FACE, vocabularyAnchor(vocabulary.id, entry.value)),
                {
                    code: null,
                    kind: vocabulary.id,
                    layer: null,
                    name: entry.value,
                    relations: entry.records.length === 0 ? [] : [{ edges: entry.records, relation }],
                    summary: entry.definition,
                },
            ]);
        }),
    );
};

export const groupReferencesOf = function groupReferencesOf(
    snapshot: OntologySnapshot,
): ReadonlyMap<string, ReferenceIndex> {
    return new Map([
        [ALGO_DOMAIN_FACE, algoDomains(snapshot)],
        [ARCH_CATEGORY_FACE, archCategories(snapshot)],
        [FORCE_FACE, forces(snapshot)],
        [KIND_FACE, kinds(snapshot)],
        [LEX_CATEGORY_FACE, lexCategories(snapshot)],
        [RELATION_FACE, relations(snapshot)],
        [VOCABULARY_FACE, vocabularies(snapshot)],
    ]);
};
