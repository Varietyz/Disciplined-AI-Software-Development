import { STATE_RULES, STATE_STRUCT } from "#configuration/constants/walk.constants";

const CALL_TOKENS: readonly string[] = ["call", "invocation"];
const DEFINITION_TOKENS: readonly string[] = ["definition", "declaration"];
const CONTAINER_SUFFIX = "_list";

export const ROLE_CALL = "call";
export const ROLE_DEFINITION = "definition";
export const ROLE_NODE = "node";

const matches = function matches(haystack: string, needles: readonly string[]): boolean {
    return needles.some((needle) => haystack.includes(needle));
};

export const roleOf = function roleOf(nodeType: string): string {
    const lower = nodeType.toLowerCase();
    if (matches(lower, CALL_TOKENS)) {
        return ROLE_CALL;
    }
    if (lower.endsWith(CONTAINER_SUFFIX)) {
        return ROLE_NODE;
    }
    return matches(lower, DEFINITION_TOKENS) ? ROLE_DEFINITION : ROLE_NODE;
};

export const stateOf = function stateOf(label: string): string {
    const lower = label.toLowerCase();
    return STATE_RULES.find((rule) => matches(lower, rule.tokens))?.state ?? STATE_STRUCT;
};
