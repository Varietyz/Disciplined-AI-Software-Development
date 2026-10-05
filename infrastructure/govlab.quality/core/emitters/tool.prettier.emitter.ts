import { CONCEPT_TO_PRETTIER_OPTION, PRETTIER_DEFAULTS } from "#configuration/constants/tool.constants";
import type { PrettierEmitPolicy } from "#types/tool.types";
import { resolveConcernMap } from "#core/converters/concern.converter";

export const emitPrettierConfig = function emitPrettierConfig(
    policy: PrettierEmitPolicy = {},
): Record<string, unknown> {
    const concernMap = resolveConcernMap(policy.concerns ?? {});
    const out: Record<string, unknown> = { ...PRETTIER_DEFAULTS, ...policy.base };
    for (const [concept, option] of CONCEPT_TO_PRETTIER_OPTION) {
        const value = concernMap.get(concept)?.value;
        if (value !== undefined) {
            out[option] = value;
        }
    }
    return out;
};
