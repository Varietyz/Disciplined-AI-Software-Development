import { CONSUMER_PREFIXES, DOM_CONSUMER_BUILTINS, REGISTER_PREFIX } from "#configuration/constants/closure.constants";

const UPPER_FIRST = 65;
const UPPER_LAST = 90;

const opensVerb = function opensVerb(name: string, prefix: string): boolean {
    if (!name.startsWith(prefix) || name.length <= prefix.length) {
        return false;
    }
    const code = name.codePointAt(prefix.length) ?? 0;
    return code >= UPPER_FIRST && code <= UPPER_LAST;
};

export const isRegisterCall = function isRegisterCall(name: string): boolean {
    return opensVerb(name, REGISTER_PREFIX);
};

export const isConsumerCall = function isConsumerCall(name: string): boolean {
    return (
        !isRegisterCall(name) &&
        !DOM_CONSUMER_BUILTINS.has(name) &&
        CONSUMER_PREFIXES.some((prefix) => opensVerb(name, prefix))
    );
};
