import { definedRepresentations, definitionOf } from "#core/registries/representation.registry";
import type { AnalysisTag } from "#types/axis.types";
import { BUILTIN_REPRESENTATIONS } from "#core/loaders/representation.loader";
import type { RepresentationRuntime } from "#types/representation.types";

type RuntimeFactory = (field: string) => RepresentationRuntime;

export const registeredRepresentations = function registeredRepresentations(): string[] {
    return [...new Set([...BUILTIN_REPRESENTATIONS, ...definedRepresentations()])].sort((a, b) => a.localeCompare(b));
};

export const runtimeFor = function runtimeFor(name: string): RuntimeFactory | undefined {
    return definitionOf(name)?.create;
};

export const applicableAnalyses = function applicableAnalyses(representation: string): readonly AnalysisTag[] {
    return definitionOf(representation)?.applicable ?? [];
};
