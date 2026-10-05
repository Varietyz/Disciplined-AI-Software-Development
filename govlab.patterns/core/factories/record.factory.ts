import type { RepresentationRuntime } from "#types/representation.types";
import type { Rng } from "#types/seed.types";
import type { SynthesizeOptions } from "#types/record.types";
import { createRng } from "#core/factories/seed.factory";
import { detectSchema } from "#core/analyzers/schema.analyzer";
import { inferMapping } from "#core/resolvers/representation.resolver";
import { runtimeFor } from "#core/selectors/representation.selector";

const DEFAULT_COUNT = 10;

const buildSamplers = function buildSamplers(
    mapping: ReadonlyMap<string, readonly string[]>,
    records: readonly unknown[],
): Map<string, RepresentationRuntime> {
    const samplers = new Map<string, RepresentationRuntime>();
    for (const [field, [first]] of mapping) {
        const factory = first === undefined ? undefined : runtimeFor(first);
        if (factory) {
            const runtime = factory(field);
            runtime.update(records);
            samplers.set(field, runtime);
        }
    }
    return samplers;
};

const drawRecord = function drawRecord(
    samplers: ReadonlyMap<string, RepresentationRuntime>,
    rng: Rng,
): Record<string, unknown> {
    const record: Record<string, unknown> = {};
    for (const [field, runtime] of samplers) {
        const value = runtime.sample(rng);
        if (value !== null) {
            record[field] = value;
        }
    }
    return record;
};

export const synthesize = function synthesize(
    records: readonly unknown[],
    options: SynthesizeOptions = {},
): Record<string, unknown>[] {
    const mapping = options.mapping ?? inferMapping(detectSchema(records, options.floatFields));
    const samplers = buildSamplers(mapping, records);
    if (samplers.size === 0) {
        return [];
    }
    const rng = createRng(options.seed ?? 0);
    return Array.from({ length: options.count ?? DEFAULT_COUNT }, () => drawRecord(samplers, rng));
};
