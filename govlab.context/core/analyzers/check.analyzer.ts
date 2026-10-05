import {
    BY_QUESTION,
    CHECK_QUESTIONS,
    DEPENDS_ON_QUESTION,
    RECORD_KEY_SEPARATOR,
    SECOND_CHECK_HOME,
    SHAPE_QUESTION,
} from "#configuration/constants/check.constants";
import type { CheckGaps, CheckResolver, CheckedRecord, CollectionCoverage, DeclaredCheck } from "#types/check.types";
import { answered, isDeclaredAbsent } from "#core/predicates/check.predicate";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import type { Faces } from "#types/context.types";
import { checkDeclarationDefectsOf } from "#core/validators/check.validator";
import { checkedRecordsOf } from "#core/selectors/check.selector";
import { slugify } from "#core/converters/identifier.converter";

const LEX_PREFIX = `${COLLECTIONS.lexicon}${RECORD_KEY_SEPARATOR}`;

const missingOf = function missingOf(record: CheckedRecord): string[] {
    return [
        ...(record.by.length === 0 ? [BY_QUESTION] : []),
        ...CHECK_QUESTIONS.filter((question) => !answered(record.facet, question)),
    ];
};

const coverageOf = function coverageOf(collection: string, records: readonly CheckedRecord[]): CollectionCoverage {
    const count = (predicate: (record: CheckedRecord) => boolean): number => records.filter(predicate).length;
    return {
        collection,
        questions: [
            { answered: count((record) => record.by.length > 0), declaredAbsent: 0, question: BY_QUESTION },
            ...CHECK_QUESTIONS.map((question) => ({
                answered: count((record) => answered(record.facet, question)),
                declaredAbsent: count((record) => isDeclaredAbsent(record.facet, question)),
                question,
            })),
            { answered: count((record) => record.shape.length > 0), declaredAbsent: 0, question: SHAPE_QUESTION },
            {
                answered: count((record) => record.dependsOn.length > 0),
                declaredAbsent: 0,
                question: DEPENDS_ON_QUESTION,
            },
        ],
        records: records.length,
    };
};

const isCollectionRef = function isCollectionRef(collections: ReadonlySet<string>, value: string): boolean {
    const separator = value.indexOf(RECORD_KEY_SEPARATOR);
    return separator > 0 && collections.has(value.slice(0, separator));
};

const refsOf = function refsOf(
    record: CheckedRecord,
    collections: ReadonlySet<string>,
): { field: string; ref: string }[] {
    return [
        ...record.by.filter((ref) => isCollectionRef(collections, ref)).map((ref) => ({ field: BY_QUESTION, ref })),
        ...(record.collection === COLLECTIONS.lexicon
            ? record.dependsOn.map((ref) => ({
                  field: DEPENDS_ON_QUESTION,
                  ref: isCollectionRef(collections, ref) ? ref : `${LEX_PREFIX}${ref}`,
              }))
            : []),
    ];
};

const unreachedByPropagationOf = function unreachedByPropagationOf(faces: Faces): string[] {
    const idByRef = new Map(
        faces.arch
            .all()
            .flatMap((principle) =>
                [principle.id, principle.name, ...(principle.aliases ?? [])].map((ref): [string, string] => [
                    slugify(ref),
                    principle.id,
                ]),
            ),
    );
    const targets = new Set(
        faces.arch
            .all()
            .flatMap((principle) => [
                ...principle.requires,
                ...principle.reinforces,
                ...principle.enables,
                ...principle.conflicts_with,
                ...principle.tensions_with,
            ])
            .map((target) => idByRef.get(slugify(target)) ?? target),
    );
    return faces.arch
        .ids()
        .filter((id) => !targets.has(id))
        .toSorted((a, b) => a.localeCompare(b));
};

export const uncoveredCollectionsOf = function uncoveredCollectionsOf(
    registered: readonly string[],
    records: readonly CheckedRecord[],
): string[] {
    const measured = new Set(records.map((record) => record.collection));
    return registered.filter((name) => !measured.has(name));
};

export const checkGapsOf = function checkGapsOf(
    faces: Faces,
    resolver: CheckResolver,
    registered: readonly string[],
    checks: readonly DeclaredCheck[],
): CheckGaps {
    const records = checkedRecordsOf(faces, checks);
    const collections = [...new Set(records.map((record) => record.collection))];
    return {
        checkDeclarationDefects: checkDeclarationDefectsOf(faces, checks),
        collections: collections.map((collection) =>
            coverageOf(
                collection,
                records.filter((record) => record.collection === collection),
            ),
        ),
        secondCheckHomes: records
            .filter((record) => record.ownBy.length > 0)
            .map((record) => ({ collection: record.collection, home: SECOND_CHECK_HOME, id: record.id })),
        uncheckedRecords: records
            .map((record) => ({ collection: record.collection, id: record.id, missing: missingOf(record) }))
            .filter((entry) => entry.missing.length > 0),
        uncoveredCollections: uncoveredCollectionsOf(registered, records),
        unreachedByPropagation: unreachedByPropagationOf(faces),
        unresolvedCheckRefs: records.flatMap((record) =>
            refsOf(record, resolver.collections)
                .filter(({ ref }) => !resolver.resolve(ref))
                .map(({ field, ref }) => ({ collection: record.collection, field, id: record.id, ref })),
        ),
    };
};
