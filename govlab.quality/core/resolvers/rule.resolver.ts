import { ruleIdsFor, toolTokensOf } from "#core/selectors/emitter.selector";
import type { ConcernConfig } from "#types/concern.types";
import type { ToolResolution } from "#types/plan.types";
import { concernsToCanonicalConfig } from "#core/converters/concern.converter";
import { loadCanonicalData } from "#core/loaders/canon.loader";
import { loadEmitTokens } from "#core/loaders/emitter.loader";
import { resolveConfig } from "#core/resolvers/plan.resolver";

const activeConcerns = function activeConcerns(resolution: ToolResolution): Set<string> {
    const disabled = new Set(resolution.disabledSurfaces);
    return new Set(
        [...Object.keys(resolution.knobs), ...resolution.enabledIntents].filter((concern) => !disabled.has(concern)),
    );
};

export const enabledRuleIds = function enabledRuleIds(
    concerns: ConcernConfig,
    language: string,
    tool: string,
): string[] {
    const data = loadCanonicalData();
    const plan = resolveConfig({ ...concernsToCanonicalConfig(concerns, data), languages: [language] }, data);
    const resolution = "conflicts" in plan ? undefined : plan.perToolConfig[tool];
    if (!resolution) {
        return [];
    }
    const toolTokens = toolTokensOf(loadEmitTokens(), tool);
    const ruleIds = [...activeConcerns(resolution)].flatMap((concern) => ruleIdsFor(toolTokens, concern));
    return [...new Set(ruleIds)].sort((a, b) => a.localeCompare(b));
};
