import type { Edge, Logger, Ontology, OntologyIssues, OntologyOptions } from "#types/ontology.types";
import { duplicateRecordId, emptyRecordId } from "#configuration/strings/ontology.strings";
import { NOOP_LOGGER } from "#core/reporters/ontology.reporter";
import { deepFreeze } from "#core/converters/base.converter";

const buildIndex = function buildIndex<R>(
    records: readonly R[],
    idOf: (record: R) => string,
    meta: { logger: Logger; label: string },
): Map<string, R> {
    const byId = new Map<string, R>();
    for (const record of records) {
        const id = idOf(record);
        if (id) {
            if (byId.has(id)) {
                meta.logger.warn(duplicateRecordId(meta.label, id));
            }
            byId.set(id, record);
        } else {
            meta.logger.warn(emptyRecordId(meta.label));
        }
    }
    return byId;
};

const findDuplicateIds = function findDuplicateIds<R>(records: readonly R[], idOf: (record: R) => string): string[] {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const record of records) {
        const id = idOf(record);
        if (seen.has(id)) {
            duplicates.push(id);
        } else {
            seen.add(id);
        }
    }
    return duplicates;
};

const danglingFor = function danglingFor<R>(
    record: R,
    from: string,
    resolver: { edgesOf: (record: R) => Edge[]; hasId: (target: string) => boolean },
): OntologyIssues["danglingEdges"] {
    const out: OntologyIssues["danglingEdges"] = [];
    for (const { relation, targets } of resolver.edgesOf(record)) {
        for (const target of targets) {
            if (!resolver.hasId(target)) {
                out.push({ from, relation, target });
            }
        }
    }
    return out;
};

const identity = function identity(target: string): string {
    return target;
};

const makeValidate = function makeValidate<R>(
    records: readonly R[],
    byId: Map<string, R>,
    idOf: (record: R) => string,
): Ontology<R>["validateOntology"] {
    return (edgesOf, resolveId = identity) => {
        const hasId = (target: string): boolean => byId.has(resolveId(target));
        return {
            danglingEdges: records.flatMap((record) => danglingFor(record, idOf(record), { edgesOf, hasId })),
            duplicateIds: findDuplicateIds(records, idOf),
        };
    };
};

export const createOntology = function createOntology<R>(options: OntologyOptions<R>): Ontology<R> {
    const { idOf, label } = options;
    const logger = options.logger ?? NOOP_LOGGER;
    const records = options.records.map((record) => deepFreeze(record));
    const byId = buildIndex(records, idOf, { label, logger });
    return {
        all: () => [...records],
        get: (id) => byId.get(id) ?? null,
        ids: () => [...byId.keys()].toSorted((a, b) => a.localeCompare(b)),
        index: () => byId,
        query: (matcher) => records.filter(matcher),
        validateOntology: makeValidate(records, byId, idOf),
    };
};
