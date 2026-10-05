import { CHECKING_EDGE_FIELDS, RECORD_KEY_SEPARATOR } from "#configuration/constants/check.constants";
import type { CheckFacet, CheckedRecord, DeclaredCheck } from "#types/check.types";
import { NEGATIVE_KIND, REPAIR_FIELDS } from "#configuration/constants/architecture.constants";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import type { Faces } from "#types/context.types";
import { PAG_KINDS } from "#configuration/schemas/grammar.schema";
import { TENSION_CHECK } from "#configuration/strings/validation.strings";
import { declaringChecksOf } from "#core/validators/check.validator";
import { keywordIdOf } from "#core/selectors/grammar.selector";
import { lacksValue } from "#core/predicates/field.predicate";

const ARCH_PREFIX = `${COLLECTIONS.architecture}${RECORD_KEY_SEPARATOR}`;
const LEX_PREFIX = `${COLLECTIONS.lexicon}${RECORD_KEY_SEPARATOR}`;

const statedRefs = function statedRefs(labels: readonly string[]): string[] {
    return labels.filter((label) => !lacksValue(label));
};

type Declaring = ReadonlyMap<string, readonly string[]>;

const archRecords = function archRecords(faces: Faces, declaring: Declaring): CheckedRecord[] {
    return faces.arch
        .all()
        .map((principle) => ({
            by: [...statedRefs(principle.enforced_by), ...(declaring.get(`${ARCH_PREFIX}${principle.id}`) ?? [])],
            collection: COLLECTIONS.architecture,
            dependsOn: [...principle.requires, ...principle.reinforces, ...principle.enables],
            facet: principle.check ?? null,
            id: principle.id,
            ownBy: principle.check?.by ?? [],
            shape: principle.type === NEGATIVE_KIND ? [principle.id] : principle.conflicts_with,
        }));
};

const inboundChecksOf = function inboundChecksOf(faces: Faces): Map<string, string[]> {
    const inbound = new Map<string, string[]>();
    const add = (target: string, check: string): void => {
        const term = faces.lex.resolve(target);
        if (term) {
            inbound.set(term.id, [...(inbound.get(term.id) ?? []), check]);
        }
    };
    for (const principle of faces.arch.all()) {
        for (const target of CHECKING_EDGE_FIELDS.flatMap((field) => principle[field])) {
            add(target, `${ARCH_PREFIX}${principle.id}`);
        }
        for (const ref of REPAIR_FIELDS.flatMap((field) => principle[field] ?? [])) {
            if (ref.startsWith(LEX_PREFIX)) {
                add(ref.slice(LEX_PREFIX.length), `${ARCH_PREFIX}${principle.id}`);
            }
        }
        for (const target of principle.tensions_with) {
            add(target, `${TENSION_CHECK}${principle.id}`);
        }
    }
    return inbound;
};

const lexRecords = function lexRecords(faces: Faces, declaring: Declaring): CheckedRecord[] {
    const inbound = inboundChecksOf(faces);
    return faces.lex
        .all()
        .map((term) => ({
            by: [
                ...new Set([
                    ...term.enforcedBy,
                    ...(inbound.get(term.id) ?? []),
                    ...(declaring.get(`${LEX_PREFIX}${term.id}`) ?? []),
                ]),
            ],
            collection: COLLECTIONS.lexicon,
            dependsOn: term.seeAlso,
            facet: term.check ?? null,
            id: term.id,
            ownBy: term.check?.by ?? [],
            shape: [],
        }));
};

const algoRecords = function algoRecords(faces: Faces): CheckedRecord[] {
    return faces.algo
        .all()
        .map((contract) => ({
            by: contract.check?.by ?? [],
            collection: COLLECTIONS.algorithms,
            dependsOn: contract.composes,
            facet: contract.check ?? null,
            id: contract.id,
            ownBy: [],
            shape: [],
        }));
};

const tabledRecord = function tabledRecord(
    collection: string,
    key: string,
    facet: CheckFacet | null,
    declaring: Declaring,
): CheckedRecord {
    return {
        by: [...(facet?.by ?? []), ...(declaring.get(`${collection}${RECORD_KEY_SEPARATOR}${key}`) ?? [])],
        collection,
        dependsOn: [],
        facet,
        id: key,
        ownBy: [],
        shape: [],
    };
};

const keyOf = function keyOf(kind: string, id: string): string {
    return `${kind}${RECORD_KEY_SEPARATOR}${id}`;
};

const reasonRecords = function reasonRecords(faces: Faces, declaring: Declaring): CheckedRecord[] {
    return [...faces.reason.kindMembers()].flatMap(([kind, ids]) =>
        [...ids].map((id) =>
            tabledRecord(COLLECTIONS.reasoning, keyOf(kind, id), faces.reason.checkOf(kind, id), declaring),
        ),
    );
};

const pagRecords = function pagRecords(faces: Faces, declaring: Declaring): CheckedRecord[] {
    const { pag } = faces;
    const ids: [string, string[]][] = [
        [PAG_KINDS.keyword, pag.keywords().map(keywordIdOf)],
        [PAG_KINDS.production, pag.productions().map((record) => record.lhs)],
        [PAG_KINDS.documentType, pag.documentTypes().map((record) => record.type)],
        [PAG_KINDS.template, pag.templates().map((record) => record.type)],
    ];
    return ids.flatMap(([kind, list]) =>
        list.map((id) => tabledRecord(COLLECTIONS.pag, keyOf(kind, id), pag.checkOf(kind, id), declaring)),
    );
};

export const checkedRecordsOf = function checkedRecordsOf(
    faces: Faces,
    checks: readonly DeclaredCheck[] = [],
): CheckedRecord[] {
    const declaring = declaringChecksOf(checks);
    return [
        ...archRecords(faces, declaring),
        ...lexRecords(faces, declaring),
        ...algoRecords(faces),
        ...reasonRecords(faces, declaring),
        ...pagRecords(faces, declaring),
    ];
};
