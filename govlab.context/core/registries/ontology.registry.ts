import type { FaceContext, OntologyFaceDefinition } from "#types/ontology.types";
import { collectionCycle, duplicateCollection, unregisteredCollection } from "#configuration/strings/ontology.strings";

const REGISTRY = new Map<string, OntologyFaceDefinition>();

export const defineOntologyFace = function defineOntologyFace<P>(
    definition: OntologyFaceDefinition<P>,
): OntologyFaceDefinition<P> {
    if (REGISTRY.has(definition.name)) {
        throw new Error(duplicateCollection(definition.name));
    }
    const frozen = Object.freeze({ ...definition, dependsOn: Object.freeze([...(definition.dependsOn ?? [])]) });
    REGISTRY.set(definition.name, frozen);
    return frozen;
};

interface FoldState {
    byName: Map<string, OntologyFaceDefinition>;
    built: Map<string, unknown>;
    building: Set<string>;
    context: FaceContext;
}

const buildFace = function buildFace(name: string, state: FoldState): unknown {
    if (state.built.has(name)) {
        return state.built.get(name);
    }
    if (state.building.has(name)) {
        throw new Error(collectionCycle(name));
    }
    const definition = state.byName.get(name);
    if (!definition) {
        throw new Error(unregisteredCollection(name));
    }
    state.building.add(name);
    const dependencies: Record<string, unknown> = {};
    for (const dependency of definition.dependsOn ?? []) {
        dependencies[dependency] = buildFace(dependency, state);
    }
    const port = definition.build(state.context, dependencies);
    state.building.delete(name);
    state.built.set(name, port);
    return port;
};

export const foldFaces = function foldFaces(
    definitions: readonly OntologyFaceDefinition[],
    context: FaceContext,
): Map<string, unknown> {
    const state: FoldState = {
        building: new Set<string>(),
        built: new Map<string, unknown>(),
        byName: new Map(definitions.map((definition) => [definition.name, definition])),
        context,
    };
    for (const definition of definitions) {
        buildFace(definition.name, state);
    }
    return state.built;
};
