import type { EmitTokens } from "#types/emitter.types";

export const toolTokensOf = function toolTokensOf(tokens: EmitTokens, tool: string): EmitTokens[string] {
    return Object.hasOwn(tokens, tool) ? (tokens[tool] ?? {}) : {};
};

export const ruleIdsFor = function ruleIdsFor(toolTokens: EmitTokens[string], canonicalId: string): string[] {
    return Object.hasOwn(toolTokens, canonicalId) ? (toolTokens[canonicalId]?.ruleIds ?? []) : [];
};
