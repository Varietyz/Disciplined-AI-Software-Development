import type { ArchRelations, EdgeRelation, KindDefinition, Principle } from "#types/architecture.types";
import { CANONICAL_KINDS, KIND_TAXONOMY } from "#configuration/constants/kind.constants";
import { EDGE_RELATIONS, RELATION_RANGES } from "#configuration/constants/architecture.constants";
import { EMPTY_DEFINITION, nonCanonicalKind } from "#configuration/strings/validation.strings";
import type { KindConsistencyViolation, LexDefect, RelationKindViolation } from "#types/validation.types";
import type { Lexicon, Term } from "#types/lexicon.types";
import type { Faces } from "#types/context.types";
import { slugify } from "#core/converters/identifier.converter";

interface KindEntry {
    id: string;
    name: string;
    aliases?: readonly string[];
    kind: string;
}

interface DefinedRecord {
    id: string;
    kind: string;
    definition: string;
}

const registerKinds = function registerKinds(kindByKey: Map<string, string>, entries: readonly KindEntry[]): void {
    for (const entry of entries) {
        for (const key of [entry.id, entry.name, ...(entry.aliases ?? [])]) {
            kindByKey.set(slugify(key), entry.kind);
        }
    }
};

export const buildKindLookup = function buildKindLookup(faces: Faces): (target: string) => string | null {
    const kindByKey = new Map<string, string>();
    registerKinds(
        kindByKey,
        faces.arch
            .all()
            .map((principle) => ({
                id: principle.id,
                kind: principle.type,
                name: principle.name,
                ...(principle.aliases ? { aliases: principle.aliases } : {}),
            })),
    );
    registerKinds(kindByKey, faces.lex.all());
    return (target) => kindByKey.get(slugify(target)) ?? null;
};

const relationViolations = function relationViolations(
    principle: Principle,
    relation: EdgeRelation,
    kindOf: (target: string) => string | null,
): RelationKindViolation[] {
    const range = RELATION_RANGES[relation];
    return principle[relation].flatMap((target) => {
        const kind = kindOf(target);
        return kind !== null && !range.has(kind)
            ? [{ allowed: [...range], from: principle.id, kind, relation, target }]
            : [];
    });
};

export const relationKindViolationsOf = function relationKindViolationsOf(
    arch: ArchRelations,
    kindOf: (target: string) => string | null,
): RelationKindViolation[] {
    return arch
        .all()
        .flatMap((principle) => EDGE_RELATIONS.flatMap((relation) => relationViolations(principle, relation, kindOf)));
};

const termDefects = function termDefects(term: Term): LexDefect[] {
    return [
        ...(CANONICAL_KINDS.has(term.kind) ? [] : [{ id: term.id, reason: nonCanonicalKind(term.kind) }]),
        ...(term.definition.trim() === "" ? [{ id: term.id, reason: EMPTY_DEFINITION }] : []),
    ];
};

const signatureViolations = function signatureViolations(
    record: DefinedRecord,
    entry: KindDefinition,
): KindConsistencyViolation[] {
    const opening = record.definition.trim().toLowerCase();
    return entry.definitionSignatures
        .filter((signature) => opening.startsWith(signature))
        .map((signature) => ({
            declaredKind: record.kind,
            id: record.id,
            opening: signature,
            signalsKind: entry.kind,
        }));
};

const kindViolationsOf = function kindViolationsOf(record: DefinedRecord): KindConsistencyViolation[] {
    return KIND_TAXONOMY.filter((entry) => entry.kind !== record.kind).flatMap((entry) =>
        signatureViolations(record, entry),
    );
};

export const lexKindIssues = function lexKindIssues(
    lex: Lexicon,
    arch: ArchRelations,
): { lexDefects: LexDefect[]; kindConsistencyViolations: KindConsistencyViolation[] } {
    return {
        kindConsistencyViolations: [
            ...lex.all().flatMap(kindViolationsOf),
            ...arch
                .all()
                .flatMap((principle) =>
                    kindViolationsOf({ definition: principle.definition, id: principle.id, kind: principle.type }),
                ),
        ],
        lexDefects: lex.all().flatMap(termDefects),
    };
};
