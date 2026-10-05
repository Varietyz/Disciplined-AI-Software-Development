import type { ConcernConfig } from "#types/concern.types";
import type { EmitFile } from "#types/emitter.types";
import type { OwnerOverride } from "#types/canon.types";
import { concernsToCanonicalConfig } from "#core/converters/concern.converter";
import { emitConfigs } from "#core/emitters/tool.emitter";
import { loadCanonicalData } from "#core/loaders/canon.loader";
import { mergeOwnership } from "#core/converters/surface.converter";
import { resolveConfig } from "#core/resolvers/plan.resolver";

export const generateNativeConfigs = async function generateNativeConfigs(
    concerns: ConcernConfig,
    languages: string[],
    ownerOverride?: OwnerOverride,
): Promise<EmitFile[]> {
    const data = loadCanonicalData();
    const ownership = mergeOwnership(data.ownership, ownerOverride);
    const plan = resolveConfig({ ...concernsToCanonicalConfig(concerns, data), languages }, { ...data, ownership });
    return "conflicts" in plan ? [] : emitConfigs(plan.perToolConfig);
};
