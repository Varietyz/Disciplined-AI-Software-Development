import { DEBUG_NAMESPACE } from "#configuration/constants/ontology.constants";

export const debugLine = function debugLine(message: string): string {
    return `[${DEBUG_NAMESPACE}] ${message}`;
};

export const duplicateRecordId = function duplicateRecordId(label: string, id: string): string {
    return `${label}: duplicate id "${id}", and the later record wins`;
};

export const emptyRecordId = function emptyRecordId(label: string): string {
    return `${label}: skipped a record with an empty id`;
};

export const duplicateCollection = function duplicateCollection(name: string): string {
    return `ontology collection "${name}" is already registered`;
};

export const collectionCycle = function collectionCycle(name: string): string {
    return `ontology collection dependency cycle at "${name}"`;
};

export const unregisteredCollection = function unregisteredCollection(name: string): string {
    return `ontology collection "${name}" is not registered`;
};

export const unbuiltCollection = function unbuiltCollection(name: string): string {
    return `govlab.context: collection "${name}" was not built`;
};

export const missingDependency = function missingDependency(collection: string, dependency: string): string {
    return `${collection} collection requires the ${dependency} collection`;
};
