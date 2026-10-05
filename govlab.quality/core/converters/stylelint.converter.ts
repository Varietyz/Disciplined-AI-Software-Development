import type { TypeSystemLayout } from "#types/config.types";

const Z_INDEX_RULE_ID = "govlab/no-magic-z-index";
const CUSTOM_PROPERTY_ORDER_RULE_ID = "govlab/custom-property-order";

const isEnabled = function isEnabled(rules: Record<string, unknown>, rule: string): boolean {
    const value = rules[rule];
    return value !== undefined && value !== null && value !== false;
};

export const typeSystemRuleOptions = function typeSystemRuleOptions(
    typeSystem: TypeSystemLayout | undefined,
    rules: Record<string, unknown>,
): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    const tokensFile = typeSystem?.tokensFile;
    if (typeof typeSystem?.zTokenPrefix === "string" && isEnabled(rules, Z_INDEX_RULE_ID)) {
        out[Z_INDEX_RULE_ID] = [true, { tokensFile, zTokenPrefix: typeSystem.zTokenPrefix }];
    }
    const segments = typeSystem?.layerSegments;
    if ((typeof tokensFile === "string" || segments !== undefined) && isEnabled(rules, CUSTOM_PROPERTY_ORDER_RULE_ID)) {
        out[CUSTOM_PROPERTY_ORDER_RULE_ID] = [true, { segments, tokensFile }];
    }
    return out;
};
