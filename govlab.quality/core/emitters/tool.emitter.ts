import type {
    ActiveConcept,
    ConfigValue,
    DescriptorFile,
    EmitDescriptor,
    EmitFile,
    EmitTokens,
} from "#types/emitter.types";
import { loadDescriptors, loadEmitTokens, loadFormatters } from "#core/loaders/emitter.loader";
import { ruleIdsFor, toolTokensOf } from "#core/selectors/emitter.selector";
import { TOGGLE_KNOB } from "#configuration/constants/emitter.constants";
import type { ToolResolution } from "#types/plan.types";
import { formatterFor } from "#core/registries/formatter.registry";
import { loadCanonicalData } from "#core/loaders/canon.loader";
import { missingFormatter } from "#configuration/strings/emitter.strings";

type SurfaceMap = Map<string, string[]>;
type ToolTokens = EmitTokens[string];

interface ToolConfigCtx {
    descriptor: EmitDescriptor;
    resolution: ToolResolution;
    surfaceMap: SurfaceMap;
    tokens: EmitTokens;
    tool: string;
}

interface EmitOptions {
    descriptorFile?: DescriptorFile | undefined;
    onSkip?: ((tool: string) => void) | undefined;
    tokens?: EmitTokens | undefined;
}

const UNSERIALIZABLE = new Set(["bigint", "function", "symbol", "undefined"]);

const isConfigValue = function isConfigValue(value: unknown): value is ConfigValue {
    return !UNSERIALIZABLE.has(typeof value);
};

const buildSurfaceMap = function buildSurfaceMap(): SurfaceMap {
    const map: SurfaceMap = new Map();
    for (const setting of loadCanonicalData().settings) {
        map.set(setting.surface, [...(map.get(setting.surface) ?? []), setting.id]);
    }
    return map;
};

const disabledRuleIds = function disabledRuleIds(
    disabledSurfaces: string[],
    surfaceMap: SurfaceMap,
    toolTokens: ToolTokens,
): string[] {
    const ids = disabledSurfaces.flatMap((surface) =>
        (surfaceMap.get(surface) ?? []).flatMap((canonicalId) => ruleIdsFor(toolTokens, canonicalId)),
    );
    return [...new Set(ids)].sort((a, b) => a.localeCompare(b));
};

const conceptFor = function conceptFor(
    resolution: ToolResolution,
    canonicalId: string,
    entry: ToolTokens[string],
): ActiveConcept | null {
    const isValueKnob = entry.knob !== null && entry.knob !== TOGGLE_KNOB;
    const raw = resolution.knobs[canonicalId];
    const base = { canonicalId, knob: isValueKnob ? entry.knob : null, ruleIds: entry.ruleIds };
    if (isValueKnob && isConfigValue(raw)) {
        return { ...base, value: raw };
    }
    return resolution.enabledIntents.includes(canonicalId) ? base : null;
};

const activeConcepts = function activeConcepts(resolution: ToolResolution, toolTokens: ToolTokens): ActiveConcept[] {
    return Object.entries(toolTokens)
        .map(([canonicalId, entry]) => conceptFor(resolution, canonicalId, entry))
        .filter((concept): concept is ActiveConcept => concept !== null);
};

export const emitToolConfig = function emitToolConfig(ctx: ToolConfigCtx): EmitFile {
    const formatter = formatterFor(ctx.descriptor.format);
    if (!formatter) {
        throw new Error(missingFormatter(ctx.descriptor.format, ctx.tool));
    }
    const toolTokens = toolTokensOf(ctx.tokens, ctx.tool);
    const concepts = activeConcepts(ctx.resolution, toolTokens);
    const ignore = disabledRuleIds(ctx.resolution.disabledSurfaces, ctx.surfaceMap, toolTokens);
    return {
        content: formatter.render({ concepts, descriptor: ctx.descriptor, ignore }),
        path: ctx.descriptor.configTarget,
    };
};

export const emitConfigs = async function emitConfigs(
    perToolConfig: Record<string, ToolResolution>,
    options: EmitOptions = {},
): Promise<EmitFile[]> {
    await loadFormatters();
    const descriptorFile = options.descriptorFile ?? loadDescriptors();
    const tokens = options.tokens ?? loadEmitTokens();
    const byTool = new Map(descriptorFile.descriptors.map((descriptor) => [descriptor.tool, descriptor]));
    const surfaceMap = buildSurfaceMap();
    return Object.entries(perToolConfig).flatMap(([tool, resolution]) => {
        const parent = descriptorFile.pluginParent[tool] ?? tool;
        const descriptor = byTool.get(parent);
        if (!descriptor) {
            options.onSkip?.(tool);
            return [];
        }
        return [emitToolConfig({ descriptor, resolution, surfaceMap, tokens, tool: parent })];
    });
};
