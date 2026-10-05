import type { RepresentationDefinition } from "#types/representation.types";

const definitions = new Map<string, RepresentationDefinition>();

export const registerRepresentation = function registerRepresentation(definition: RepresentationDefinition): void {
    definitions.set(definition.name, definition);
};

export const definitionOf = function definitionOf(name: string): RepresentationDefinition | undefined {
    return definitions.get(name);
};

export const definedRepresentations = function definedRepresentations(): readonly string[] {
    return [...definitions.keys()];
};
