import type { FaceContext, PatternFaceDefinition } from "#types/pattern.types";
import { faceCycle, faceRegistered, faceUnregistered } from "#configuration/strings/pattern.strings";

interface FoldState {
    byName: Map<string, PatternFaceDefinition>;
    built: Map<string, unknown>;
    building: Set<string>;
    context: FaceContext;
}

const REGISTRY = new Map<string, PatternFaceDefinition>();

export const definePatternFace = function definePatternFace<P>(
    definition: PatternFaceDefinition<P>,
): PatternFaceDefinition<P> {
    if (REGISTRY.has(definition.name)) {
        throw new Error(faceRegistered(definition.name));
    }
    const frozen = Object.freeze({ ...definition, dependsOn: Object.freeze([...(definition.dependsOn ?? [])]) });
    REGISTRY.set(definition.name, frozen);
    return frozen;
};

export const registeredFaces = function registeredFaces(): readonly PatternFaceDefinition[] {
    return [...REGISTRY.values()];
};

const buildFace = function buildFace(name: string, state: FoldState): unknown {
    if (state.built.has(name)) {
        return state.built.get(name);
    }
    if (state.building.has(name)) {
        throw new Error(faceCycle(name));
    }
    const definition = state.byName.get(name);
    if (!definition) {
        throw new Error(faceUnregistered(name));
    }
    state.building.add(name);
    const dependencies = Object.fromEntries(
        (definition.dependsOn ?? []).map((dependency) => [dependency, buildFace(dependency, state)]),
    );
    const port = definition.build(state.context, dependencies);
    state.building.delete(name);
    state.built.set(name, port);
    return port;
};

export const foldFaces = function foldFaces(
    definitions: readonly PatternFaceDefinition[],
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
